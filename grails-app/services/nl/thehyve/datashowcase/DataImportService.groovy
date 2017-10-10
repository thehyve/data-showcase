package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import grails.validation.ValidationException
import nl.thehyve.datashowcase.deserialisation.JsonDataDeserializer
import nl.thehyve.datashowcase.exception.InvalidDataException
import org.grails.datastore.gorm.GormEntity
import org.grails.web.json.JSONArray
import org.grails.web.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired

@Transactional
class DataImportService {

    @Autowired
    JsonDataDeserializer jsonDataDeserializer

    def upload(JSONObject json) {
        try {
            // save concepts and related keywords
            def concepts = json.concepts?.collect { new Concept(it) }
            validate(concepts)
            concepts*.save(flush: true, failOnError: true)

            // save tree_nodes
            jsonDataDeserializer.replace("conceptCode", "concept", (JSONArray)json.tree_nodes)
            def tree_nodes = json.tree_nodes?.collect { new TreeNode(it) }
            validate(tree_nodes)
            tree_nodes*.save(flush: true, failOnError: true)

            // save projects and related research_lines
            def projects = json.projects?.collect { new Project(it) }
            validate(projects)
            projects*.save(flush: true, failOnError: true)

            // save items, related summaries and values
            jsonDataDeserializer.replace("conceptCode", "concept", (JSONArray)json.items)
            jsonDataDeserializer.replace("projectName", "project", (JSONArray)json.items)
            def items = json.items?.collect { new Item(it) }
            validate(items)
            items*.save(flush: true, failOnError: true)
        } catch (ValidationException e) {
            throw new InvalidDataException(e.toString())
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
}
