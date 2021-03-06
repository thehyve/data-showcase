/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import grails.converters.JSON
import grails.testing.mixin.integration.Integration
import grails.transaction.Rollback
import groovy.util.logging.Slf4j
import nl.thehyve.datashowcase.enumeration.NodeType
import nl.thehyve.datashowcase.enumeration.VariableType
import nl.thehyve.datashowcase.exception.InvalidDataException
import org.grails.web.json.JSONObject
import org.hibernate.SessionFactory
import org.springframework.beans.factory.annotation.Autowired
import spock.lang.Requires
import spock.lang.Specification

@Slf4j
@Integration
@Rollback
class DataImportServiceSpec extends Specification {

    @Autowired
    DataImportService dataImportService

    @Autowired
    DataService dataService

    SessionFactory sessionFactory

    URL jsonUrl = getClass().getClassLoader().getResource('test.json')
    File file = new File(jsonUrl.path)

    def setupData() {
        log.info "Clear database ..."
        dataService.clearDatabase()
        sessionFactory.currentSession.flush()
    }

    def loadValidData() {
        log.info "Upload test data set ..."
        JSONObject json = (JSONObject)JSON.parse(file.text)
        dataImportService.upload(json)
        sessionFactory.currentSession.flush()
    }

    def loadInvalidData() {
        log.info "Replace with invalid data ..."
        file.text = file.text.replaceAll('"publicItem": true', '"publicItem": false')
        JSONObject json = (JSONObject)JSON.parse(file.text)
        log.info "Upload test data set ..."
        dataImportService.upload(json)
        sessionFactory.currentSession.flush()
    }

    @Requires({ -> Environment.grailsEnvironmentIn(Constants.PUBLIC_ENVIRONMENTS) })
    void "test json data upload"() {
        given: 'the database is clean'
        setupData()

        when: 'loading valid data'
        loadValidData()

        // fetch objects from db
        then: 'the data is stored in the database'
        def items = Item.getAll()
        def concepts = Concept.getAll()
        def keywords = Keyword.getAll()
        def linesOfResearch = LineOfResearch.getAll()
        def projects = Project.getAll()
        def summaries = Summary.getAll()
        def treeNodes = TreeNode.getAll()
        def values = Value.getAll()

        items.size() == 2
        items*.name == ['ageA', 'heightB']
        items*.itemPath == ['/Personal information/Basic information/Age',
                            '/Personal information/Extended information/Height']
        items.every { it.publicItem == true }
        items*.summary == summaries
        items*.summary*.values?.flatten() as Set == values as Set
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
        summaries*.patientsWithMissingCount == [25, 40]
        summaries*.observationCount == [102, 402]
        summaries*.dataStability == ['Committed', 'Committed']
        summaries*.values.flatten() as Set == values as Set

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

        values.size() == 4
        values*.value as Set == ['<= 65', '> 65', '<= 175', '> 175'] as Set
        values*.label as Set == ['Young', 'Old', 'Short', 'Tall'] as Set
        values*.frequency as Set == [35, 65, 36, 64] as Set
    }

    @Requires({ -> Environment.grailsEnvironmentIn(Constants.PUBLIC_ENVIRONMENTS) })
    void "test json data reupload"() {
        given: 'the database contains data'
        setupData()
        loadValidData()

        when: 'reloading valid data'
        loadValidData()

        // fetch objects from db
        then: 'the data is stored in the database'
        def items = Item.getAll()
        def concepts = Concept.getAll()
        def keywords = Keyword.getAll()
        def linesOfResearch = LineOfResearch.getAll()
        def projects = Project.getAll()
        def summaries = Summary.getAll()
        def treeNodes = TreeNode.getAll()
        def values = Value.getAll()

        items.size() == 2
        items*.name == ['ageA', 'heightB']
        items*.itemPath == ['/Personal information/Basic information/Age',
                            '/Personal information/Extended information/Height']
        items.every { it.publicItem == true }
        items*.summary == summaries
        items*.summary*.values?.flatten() as Set == values as Set
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
        summaries*.values.flatten() as Set == values as Set

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

        values.size() == 4
        values*.value.every { v -> v in ['<= 65', '> 65', '<= 175', '> 175'] }
        values*.label.every { l -> l in ['Young', 'Old', 'Short', 'Tall'] }
        values*.frequency.every { f -> (int)f in [35, 65, 36, 64] }
    }

    @Requires({ -> Environment.grailsEnvironmentIn(Constants.PUBLIC_ENVIRONMENTS) })
    void "test publicItem flag validation"() {
        given: 'the database is clean'
        setupData()

        when: 'loading invalid data'
        loadInvalidData()

        then:
        InvalidDataException ex = thrown()
        ex.message == "An error occured when uploading the data: Data validation exception. " +
                "Non public item cannot be loaded to a public environment"
    }
}
