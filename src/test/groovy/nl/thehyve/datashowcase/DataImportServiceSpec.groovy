package nl.thehyve.datashowcase

import grails.converters.JSON
import grails.testing.mixin.integration.Integration
import groovy.util.logging.Slf4j
import nl.thehyve.datashowcase.enumeration.NodeType
import nl.thehyve.datashowcase.enumeration.VariableType
import nl.thehyve.datashowcase.exception.InvalidDataException
import org.grails.web.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional
import spock.lang.Requires
import spock.lang.Specification

@Slf4j
@Integration
@Transactional
class DataImportServiceSpec extends Specification {

    @Autowired
    DataImportService dataImportService

    @Autowired
    DataService dataService

    def setupData() {
        log.info "Clear database ..."
        dataService.clearDatabase()
        log.info "Upload test data set ..."
        dataImportService.upload((JSONObject) JSON.parse(dataString))
    }

    def dataString = '{ "items": [ { "conceptCode": "age", "publicItem": true, "summary": { "observationCount": 102, ' +
            '"dataStability": "Committed", "maxValue": null, "patientCount": 100, "minValue": null, "avgValue": null, ' +
            '"stdDevValue": null, "values": [ { "value": "<= 65", "frequency": 35, "label": "Young" }, ' +
            '{ "value": "> 65", "frequency": 65, "label": "Old" } ] }, "itemPath": "/Personal information/Basic ' +
            'information/Age", "name": "ageA", "projectName": "Project A" }, { "conceptCode": "height", ' +
            '"publicItem": true, "summary": { "observationCount": 402, "dataStability": "Committed", "maxValue":' +
            ' null, "patientCount": 200, "minValue": null, "avgValue": null, "stdDevValue": null, "values": ' +
            '[ { "value": "<= 175", "frequency": 36, "label": "Short" }, { "value": "> 175", "frequency": 64, ' +
            '"label": "Tall" } ] }, "itemPath": "/Personal information/Extended information/Height", "name": "heightB", ' +
            '"projectName": "Project B" } ], "concepts": [ { "labelNlLong": "Leeftijd van het onderwerp", "labelNl": ' +
            '"Leeftijd", "conceptCode": "age", "variableType": "Categorical", "labelLong": "Age at time of survey", ' +
            '"label": "Age", "keywords": [ "Personal information" ] }, { "labelNlLong": "Hoogte van het onderwerp", ' +
            '"labelNl": "Hoogte", "conceptCode": "height", "variableType": "Categorical", "labelLong": ' +
            '"Height at time of survey", "label": "Height", "keywords": [ "Personal information", "Family related", ' +
            '"Body characteristics" ] }, { "labelNlLong": "Gewicht (kg)", "labelNl": "Gewicht", "conceptCode": ' +
            '"weight", "variableType": "Numerical", "labelLong": "Weight (kg)", "label": "Weight", "keywords": ' +
            '[ "Personal information", "Family related", "Body characteristics" ] } ], "projects": [ { "name": ' +
            '"Project A", "description": "First test project", "lineOfResearch": "Research line 1" }, { "name": ' +
            '"Project B", "description": "Second test project", "lineOfResearch": "Research line 2" } ], ' +
            '"tree_nodes": [ { "conceptCode": null, "path": "/Personal information", "nodeType": "Domain", ' +
            '"label": "Personal information", "children": [ { "conceptCode": null, "path": "/Personal ' +
            'information/Basic information", "nodeType": "Domain", "label": "Basic information", "children": ' +
            '[ { "conceptCode": "age", "path": "/Personal information/Basic information/Age", "nodeType": "Concept",' +
            ' "label": "Age", "children": [ ] }, { "conceptCode": "age", "path": "/Personal information/Basic ' +
            'information/Weight", "nodeType": "Concept", "label": "Weight", "children": [ ] } ] }, { "conceptCode":' +
            ' null, "path": "/Personal information/Extended information", "nodeType": "Domain", "label": ' +
            '"Extended information", "children": [ { "conceptCode": "height", "path": "/Personal information/' +
            'Extended information/Height", "nodeType": "Concept", "label": "Height", "children": [ ] }, { ' +
            '"conceptCode": null, "path": "/Personal information/Extended information/Some details", "nodeType":' +
            ' "Domain", "label": "Some details", "children": [ ] } ] } ] }, { "conceptCode": null, "path": "/Other ' +
            'information", "nodeType": "Domain", "label": "Other information", "children": [ { "conceptCode": null, ' +
            '"path": "/Other information/Some information", "nodeType": "Domain", "label": "Some information", ' +
            '"children": [ ] } ] } ] }'

    @Requires({ -> Environment.grailsEnvironmentIn(Constants.PUBLIC_ENVIRONMENTS) })
    void "test json data upload"() {
        given:
        setupData()
        when:
        log.info "Running test ..."
        def items = Item.getAll()
        def concepts = Concept.getAll()
        def keywords = Keyword.getAll()
        def linesOfResearch = LineOfResearch.getAll()
        def projects = Project.getAll()
        def summaries = Summary.getAll()
        def treeNodes = TreeNode.getAll()
        def values = Value.getAll()

        then: "All elements are uploaded correctly"
        items.size() == 2
        items*.name == ['ageA', 'heightB']
        items*.itemPath == ['/Personal information/Basic information/Age',
                            '/Personal information/Extended information/Height']
        items.every { it.publicItem == true }
        items*.summary == summaries
        items*.summary*.values?.flatten() == values
        items*.concept.every { concepts.indexOf(it) != -1 }
        items*.project.every { projects.indexOf(it) != -1 }

        concepts.size() == 3
        concepts*.conceptCode == ['age', 'height', 'weight']
        concepts*.label == ['Age', 'Height', 'Weight']
        concepts*.labelLong == ['Age at time of survey', 'Height at time of survey', 'Weight (kg)']
        concepts*.labelNl == ['Leeftijd', 'Hoogte', 'Gewicht']
        concepts*.labelNlLong == ['Leeftijd van het onderwerp', 'Hoogte van het onderwerp', 'Gewicht (kg)']
        concepts*.variableType == [VariableType.Categorical, VariableType.Categorical, VariableType.Numerical]
        concepts*.keywords.flatten() as Set == keywords as Set

        keywords.size() == 3
        keywords*.keyword == ['Personal information', 'Family related', 'Body characteristics']

        projects.size() == 2
        projects*.name == ['Project A', 'Project B']
        projects*.description == ['First test project', 'Second test project']
        projects*.lineOfResearch == linesOfResearch

        linesOfResearch.size() == 2
        linesOfResearch*.name == ['Research line 1', 'Research line 2']

        summaries.size() == 2
        summaries*.patientCount == [100, 200]
        summaries*.observationCount == [102, 402]
        summaries*.dataStability == ['Committed', 'Committed']
        summaries*.values.flatten() == values

        treeNodes.size() == 9
        treeNodes*.label.sort() == ['Personal information', 'Basic information', 'Age', 'Weight', 'Extended information',
                                    'Some details', 'Height', 'Other information', 'Some information'].sort()
        treeNodes.every { node ->
            if (node.label in ['Age', 'Weight', 'Height']) {
                node.nodeType == NodeType.Concept && node.concept != null && node.children.size() == 0 && node.parent != null
            } else
                node.nodeType == NodeType.Domain
        }
        treeNodes*.path.sort() == ['/Personal information',
                                   '/Personal information/Basic information',
                                   '/Personal information/Basic information/Age',
                                   '/Personal information/Basic information/Weight',
                                   '/Personal information/Extended information',
                                   '/Personal information/Extended information/Height',
                                   '/Personal information/Extended information/Some details',
                                   '/Other information',
                                   '/Other information/Some information'].sort()

        values.size() == 8
        values*.value.every { v -> v in ['<= 65', '> 65', '<= 175', '> 175'] }
        values*.label.every { l -> l in ['Young', 'Old', 'Short', 'Tall'] }
        values*.frequency.every { f -> (int)f in [35, 65, 36, 64] }
    }

    @Requires({ -> Environment.grailsEnvironmentIn(Constants.PUBLIC_ENVIRONMENTS) })
    void "test publicItem flag validation"() {
        given:
        dataString = dataString.replaceAll('"publicItem": true', '"publicItem": false')
        when:
        setupData()
        then:
        InvalidDataException ex = thrown()
        ex.message == "An error occured when uploading the data: Data validation exception. " +
                "Non public item cannot be loaded to a public environment"
    }
}
