package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import grails.validation.ValidationException
import nl.thehyve.datashowcase.exception.InvalidDataException
import nl.thehyve.datashowcase.exception.ResourceNotFoundException
import org.grails.datastore.gorm.GormEntity
import org.grails.web.json.JSONArray
import org.grails.web.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired

@Transactional
class DataImportService {

    @Autowired
    Environment dataShowcaseEnvironment

    def upload(JSONObject json) {
        try {
            // save concepts and related keywords
            def concepts = json.concepts?.collect { new Concept(it) }
            validate(concepts)
            log.info('Saving concepts...')
            concepts*.save(flush: true, failOnError: true)

            // save tree_nodes
            replace("conceptCode", "concept", (JSONArray) json.tree_nodes)
            def tree_nodes = json.tree_nodes?.collect { new TreeNode(it) }
            validate(tree_nodes)
            log.info('Saving tree nodes...')
            tree_nodes*.save(flush: true, failOnError: true)

            // save projects and related research_lines
            def projects = json.projects?.collect { new Project(it) }
            validate(projects)
            log.info('Saving projects and research lines...')
            projects*.save(flush: true, failOnError: true)

            // save items, related summaries and values
            if (!dataShowcaseEnvironment.internalInstance && !allItemsArePublic((JSONArray) json.items)) {
                throw new InvalidDataException("Data validation exception. " +
                        "Non public item cannot be loaded to a public environment")
            }
            replace("conceptCode", "concept", (JSONArray) json.items)
            replace("projectName", "project", (JSONArray) json.items)
            def items = json.items?.collect { new Item(it) }
            validate(items)
            log.info('Saving items, summaries, values...')
            items*.save(flush: true, failOnError: true)

        } catch (ValidationException e) {
            throw new InvalidDataException(e.message)
        } catch (Exception e) {
            throw new InvalidDataException("An error occured when uploading the data: $e.message")
        }
    }

    private static def validate(List<GormEntity> entities) {
        entities.each { entity ->
            if (entity.hasErrors()) {
                throw new InvalidDataException("Validation errors: ${entity.errors.toString()} ")
            }
        }
    }

    private static boolean allItemsArePublic(JSONArray items) {
        return items.every { it.publicItem == true }
    }

    private static JSONArray replace(String oldKey, String newKey, JSONArray jsonObj) {
        jsonObj.forEach { JSONObject node ->
            if (node[oldKey]) {
                def value = find(oldKey, (String)node[oldKey])
                node.remove(oldKey)
                node.put(newKey, value)
            } else if (node.children) {
                replace(oldKey, newKey, (JSONArray) node.children)
            }
        }
        jsonObj
    }

    private static Object find(String key, String value) {
        switch (key) {
            case "conceptCode":
                return Concept.findByConceptCode(value)
            case "projectName":
                return Project.findByName(value)
            default:
                throw new ResourceNotFoundException("No domain class related to a key: $key was found")
        }
    }
}
