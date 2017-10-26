/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import com.sun.org.apache.xpath.internal.compiler.Keywords
import grails.gorm.transactions.Transactional
import grails.validation.ValidationException
import nl.thehyve.datashowcase.exception.InvalidDataException
import org.grails.datastore.gorm.GormEntity
import org.grails.web.json.JSONArray
import org.grails.web.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired

@Transactional
class DataImportService {

    @Autowired
    Environment dataShowcaseEnvironment

    @Autowired
    DataService dataService

    def upload(JSONObject json) {
        try {
            // clear database
            log.info('Clearing database...')
            dataService.clearDatabase()

            // save keywords
            def keywords = json.concepts?.keywords?.flatten().unique().collect {
                if(it?.trim()) new Keyword(keyword: it)
            }
            keywords.removeAll([null])
            validate(keywords)
            log.info('Saving keywords...')
            keywords*.save(flush: true, failOnError: true)

            // save concepts
            def concepts = json.concepts?.collect { new Concept(it) }
            validate(concepts)
            log.info('Saving concepts...')
            concepts*.save(flush: true, failOnError: true)

            // save tree_nodes
            def tree_nodes = json.tree_nodes?.collect { JSONObject it ->
                copyConceptCode(it)
                new TreeNode(it)
            }
            validate(tree_nodes)
            log.info('Saving tree nodes...')
            tree_nodes*.save(flush: true, failOnError: true)

            //save research_lines
            def linesOfResearch = json.projects?.lineOfResearch.unique().collect {
                if (it) new LineOfResearch(name: it)
            }
            validate(linesOfResearch)
            log.info("Saving lines of research...")
            linesOfResearch*.save(flush: true, failOnError: true)

            // save projects
            def projects = json.projects?.collect { new Project(it) }
            validate(projects)
            log.info("Saving projects...")
            projects*.save(flush: true, failOnError: true)

            // save items, related summaries and values
            if (!dataShowcaseEnvironment.internalInstance && !allItemsArePublic((JSONArray) json.items)) {
                log.error "Non public item cannot be loaded to a public environment"
                throw new InvalidDataException("Data validation exception. " +
                        "Non public item cannot be loaded to a public environment")
            }
            def items = json.items?.collect { JSONObject it ->
                it.concept = it.conceptCode
                def item = new Item(it)
                item.project = Project.findByName(it.projectName as String)
                item
            }
            validate(items)
            log.info("Saving $items.size() items, summaries, values...")
            items*.save(flush: true, failOnError: true)

        } catch (ValidationException e) {
            log.error e.message
            throw new InvalidDataException(e.message)
        } catch (Exception e) {
            log.error e.message
            throw new InvalidDataException("An error occured when uploading the data: $e.message")
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

    private static void copyConceptCode(JSONObject obj) {
        obj.concept = obj.conceptCode
        if (obj.children) {
            (obj.children as JSONArray).each {
                copyConceptCode(it as JSONObject)
            }
        }
    }
}
