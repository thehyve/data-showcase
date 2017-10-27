/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import grails.validation.ValidationException
import nl.thehyve.datashowcase.exception.InvalidDataException
import org.grails.core.util.StopWatch
import org.grails.datastore.gorm.GormEntity
import org.grails.web.json.JSONArray
import org.grails.web.json.JSONObject
import org.hibernate.HibernateException
import org.hibernate.Session
import org.hibernate.SessionFactory
import org.hibernate.StatelessSession
import org.hibernate.Transaction
import org.springframework.beans.factory.annotation.Autowired

@Transactional
class DataImportService {

    @Autowired
    Environment dataShowcaseEnvironment

    @Autowired
    DataService dataService

    @Autowired
    ItemService itemService

    SessionFactory sessionFactory

    def upload(JSONObject json) {
        def stopWatch = new StopWatch('Upload data')
        // clear database
        log.info('Clearing database...')
        stopWatch.start('Clear database')
        dataService.clearDatabase()
        stopWatch.stop()

        Session session = null
        Transaction tx = null
        try {
            session = sessionFactory.openSession()
            tx = session.beginTransaction()

            // save keywords
            def keywords = json.concepts?.keywords?.flatten().unique().collect {
                if (it?.trim()) new Keyword(keyword: it)
            } as List<Keyword>
            keywords.removeAll([null])
            validate(keywords)
            log.info('Saving keywords...')
            stopWatch.start('Save keywords')
            keywords*.save()
            stopWatch.stop()
            def keywordMap = keywords.collectEntries { [(it.keyword): it] } as Map<String, Keyword>

            // save concepts
            def concepts = json.concepts?.collect {
                def conceptKeywords = it.remove('keywords')
                def concept = new Concept(it as JSONObject)
                conceptKeywords.each {
                    def keyword = keywordMap[it?.trim() as String]
                    if (keyword) {
                        concept.addToKeywords(keyword)
                    }
                }
                concept
            } as List<Concept>
            validate(concepts)
            log.info('Saving concepts...')
            stopWatch.start('Save concepts')
            concepts*.save()
            stopWatch.stop()
            def conceptMap = concepts.collectEntries { [(it.conceptCode): it] } as Map<String, Concept>

            session.flush()
            session.clear()

            // save tree_nodes
            def tree_nodes = flatten(buildTree(json.tree_nodes as JSONArray, conceptMap))
            validate(tree_nodes)
            log.info('Saving tree nodes...')
            stopWatch.start('Save tree nodes')
            tree_nodes*.save()
            stopWatch.stop()

            session.flush()
            session.clear()

            //save research_lines
            def linesOfResearch = json.projects?.lineOfResearch.unique().collect {
                if (it) new LineOfResearch(name: it)
            } as List<LineOfResearch>
            validate(linesOfResearch)
            log.info("Saving lines of research...")
            stopWatch.start('Save lines of research')
            linesOfResearch*.save()
            stopWatch.stop()
            def lineOfResearchMap = linesOfResearch.collectEntries { [(it.name): it]} as Map<String, LineOfResearch>

            // save projects
            def projects = json.projects?.collect { JSONObject it ->
                def lineOfResearch = it.remove('lineOfResearch') as String
                def project = new Project(it)
                project.lineOfResearch = lineOfResearchMap[lineOfResearch]
                if (!project.lineOfResearch) {
                    throw new InvalidDataException("No valid line of research set for project ${project.name}.")
                }
                project
            } as List<Project>
            validate(projects)
            log.info("Saving projects...")
            stopWatch.start('Save projects')
            projects*.save()
            stopWatch.stop()
            def projectMap = projects.collectEntries { [(it.name): it] } as Map<String, Project>

            session.flush()
            session.clear()

            // save items, related summaries and values
            if (!dataShowcaseEnvironment.internalInstance && !allItemsArePublic((JSONArray) json.items)) {
                log.error "Non public item cannot be loaded to a public environment"
                throw new InvalidDataException("Data validation exception. " +
                        "Non public item cannot be loaded to a public environment")
            }
            def summaryMap = [:] as Map<String, Summary>
            def items = json.items?.collect { JSONObject it ->
                def summaryData = it.remove('summary') as JSONObject
                def item = new Item(it)
                summaryMap[item.name] = new Summary(summaryData)
                item.concept = conceptMap[it.conceptCode as String]
                if (!item.concept) {
                    throw new InvalidDataException("No valid concept code set for item ${item.name}.")
                }
                item.project = projectMap[it.projectName as String]
                if (!item.project) {
                    throw new InvalidDataException("No valid project name set for item ${item.name}.")
                }
                item
            } as List<Item>
            validate(items)
            log.info"Saving ${items.size()} items ..."
            stopWatch.start('Save items')
            def count = 0
            def countWidth = items.size().toString().size()
            items.collate(500).each{ sublist ->
                sublist*.save()
                count += sublist.size()
                log.info "  [${count.toString().padLeft(countWidth)} / ${items.size()}] items saved"
                sublist.each {
                    it.setSummary(summaryMap[it.name])
                    it.summary?.item = it
                }
                log.info "  [${count.toString().padLeft(countWidth)} / ${items.size()}] summaries saved"
                sublist*.summary*.save()

                session.flush()
                session.clear()
            }
            stopWatch.stop()
            log.info "All items saved."

            stopWatch.start('Commit transaction')
            tx.commit()
            stopWatch.stop()

            log.info "Upload completed.\n${stopWatch.prettyPrint()}"

            itemService.clearItemCountsCache()

        } catch (ValidationException e) {
            log.error "Invalid data uploaded", e
            tx?.rollback()
            throw new InvalidDataException("An error occured when uploading the data: ${e.message}")
        } catch (Exception e) {
            log.error "Error while saving data", e
            tx?.rollback()
            throw new InvalidDataException("An error occured when uploading the data: ${e.message}")
        } finally{
            session?.close()
        }
    }

    private static def validate(List<GormEntity> entities) {
        entities.each { entity ->
            if (entity.hasErrors()) {
                log.error entity.errors.toString()
                throw new InvalidDataException("Validation errors: ${entity.errors.toString()} ")
            }
        }
    }

    private static boolean allItemsArePublic(JSONArray items) {
        return items.every { it.publicItem == true }
    }

    private static List<TreeNode> flatten(Collection<TreeNode> nodes) {
        if (nodes == null) {
            return []
        }
        nodes.collectMany { node ->
            [node] + flatten(node.children)
        }
    }

    private static List<TreeNode> buildTree(JSONArray nodes, final Map<String, Concept> conceptMap) {
        if (nodes == null) {
            return null
        }
        nodes.collect { JSONObject nodeData ->
            def childrenData = nodeData.remove('children') as JSONArray
            def node = new TreeNode(nodeData)
            if (nodeData.conceptCode) {
                node.concept = conceptMap[nodeData.conceptCode as String]
                if (!node.concept) {
                    throw new InvalidDataException("Invalid concept code set for tree node ${node.path}.")
                }
            }
            node.children = buildTree(childrenData, conceptMap)
            node.children?.each {
                it.parent = node
            }
            node
        }
    }
}
