package nl.thehyve.datashowcase.deserialisation

import nl.thehyve.datashowcase.Concept
import nl.thehyve.datashowcase.Project
import nl.thehyve.datashowcase.exception.ResourceNotFoundException
import org.grails.web.json.JSONArray
import org.grails.web.json.JSONObject

class JsonDataDeserializer {

    JSONArray replace(String oldKey, String newKey, JSONArray jsonObj) {
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
