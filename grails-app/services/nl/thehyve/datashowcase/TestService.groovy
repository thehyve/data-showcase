package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import nl.thehyve.datashowcase.enumeration.VariableType

import static nl.thehyve.datashowcase.Environment.checkGrailsEnvironment

@Transactional
class TestService {

    /**
     * Creates and stores test domains.
     */
    def createConceptTestData() {
        checkGrailsEnvironment(Constants.DEV_ENVIRONMENTS, Constants.TEST_ENVIRONMENTS)

        def conceptAge = new Concept(
                conceptCode: 'age',
                label: 'Age', labelLong: 'Age at time of survey',
                variableType: VariableType.Numerical)
        def conceptHeight = new Concept(
                conceptCode: 'height',
                label: 'Height', labelLong: 'Height at time of survey',
                variableType: VariableType.Numerical)
        def concepts = [conceptAge, conceptHeight]
        def domain1 = new TreeNode(null, 'Personal information')
        def subdomain11 = new TreeNode(domain1, 'Basic information')
        def conceptNodeAge = new TreeNode(subdomain11, conceptAge)
        def subdomain12 = new TreeNode(domain1, 'Extended information')
        def conceptNodeHeight = new TreeNode(subdomain12, conceptHeight)
        def subdomain121 = new TreeNode(subdomain12, 'Some details')
        def domain2 = new TreeNode(null, 'Other information')
        def subdomain2 = new TreeNode(domain2, 'Some information')
        def nodes = [domain1, subdomain11, conceptNodeAge, subdomain12, conceptNodeHeight, subdomain121, domain2, subdomain2]
        concepts*.save()
        nodes*.save()
        nodes.each { node ->
            log.info "Created node ${node.label}, parent: ${node.parent?.path}, path: ${node.path}"
        }
        concepts
    }

    /**
     * Creates and stores test objects for the internal environment (including
     * non-public items and extensive summary data).
     */
    def createInternalTestData() {
        checkGrailsEnvironment(Constants.INTERNAL_ENVIRONMENTS)

        def concepts = createConceptTestData()

        def researchLine1 = new LineOfResearch(name: 'Research line 1')
        def researchLine2 = new LineOfResearch(name: 'Research line 2')

        def projectA = new Project(name: 'Project A', description: 'First test project', lineOfResearch: researchLine1)
        def projectB = new Project(name: 'Project B', description: 'Second test project', lineOfResearch: researchLine2)

        [researchLine1, researchLine2, projectA, projectB]*.save()

        def keyword1 = new Keyword(keyword: 'Personal information')
        def keyword2 = new Keyword(keyword: 'Family related')
        def keyword3 = new Keyword(keyword: 'Body characteristics')

        [keyword1, keyword2, keyword3]*.save()

        def item1 = new Item(
                name: 'ageA',
                label: 'age',
                labelLong: 'Age of the subject',
                itemType: VariableType.Numerical,
                publicItem: true,
                constraintJson: '{"type": "concept", "concept_cd": "age"}',
                keywords: [keyword1, keyword3],
                concept: concepts[0],
                project: projectA,
                summary: new Summary(
                        patientCount: 100,
                        observationCount: 102,
                        dataStability: 13.78,
                        minValue: 8,
                        avgValue: 40,
                        maxValue: 99,
                        stdDevValue: 17.6,
                        )
                        .addToValues(new Value(label: 'Young', value: '<= 60', frequency: 30))
                        .addToValues(new Value(label: 'Old', value: '> 60', frequency: 60))
        )

        def item2 = new Item(
                name: 'heightB',
                label: 'height',
                labelLong: 'Height of the subject',
                itemType: VariableType.Numerical,
                publicItem: false,
                constraintJson: '{"type": "concept", "concept_cd": "height"}',
                summary: new Summary(
                        patientCount: 200,
                        observationCount: 402,
                        dataStability: 15.78
                ),
                keywords: [keyword3],
                concept: concepts[1],
                project: projectB
        )

        [item1, item2]*.save()
    }

    /**
     * Creates and stores test objects for the public environment (with
     * only public items and limited summary data).
     */
    def createPublicTestData() {
        checkGrailsEnvironment(Constants.PUBLIC_ENVIRONMENTS)

        def concepts = createConceptTestData()

        def researchLine1 = new LineOfResearch(name: 'Research line 1')
        def researchLine2 = new LineOfResearch(name: 'Research line 2')

        def projectA = new Project(name: 'Project A', description: 'First test project', lineOfResearch: researchLine1)
        def projectB = new Project(name: 'Project B', description: 'Second test project', lineOfResearch: researchLine2)

        [researchLine1, researchLine2, projectA, projectB]*.save()

        def keyword1 = new Keyword(keyword: 'Personal information')
        def keyword2 = new Keyword(keyword: 'Family related')
        def keyword3 = new Keyword(keyword: 'Body characteristics')

        [keyword1, keyword2, keyword3]*.save()

        def item1 = new Item(
                name: 'ageA',
                label: 'age',
                labelLong: 'Age of the subject',
                itemType: VariableType.Numerical,
                publicItem: true,
                constraintJson: '{"type": "concept", "concept_cd": "age"}',
                keywords: [keyword1, keyword3],
                concept: concepts[0],
                project: projectA,
                summary: new Summary(
                        patientCount: 100,
                        observationCount: 102,
                        dataStability: 13.78)
                        .addToValues(new Value(label: 'Young', value: '<= 60'))
                        .addToValues(new Value(label: 'Old', value: '> 60'))
        )

        def item2 = new Item(
                name: 'heightB',
                label: 'height',
                labelLong: 'Height of the subject',
                itemType: VariableType.Numerical,
                publicItem: true,
                constraintJson: '{"type": "concept", "concept_cd": "height"}',
                summary: new Summary(
                        patientCount: 200,
                        observationCount: 402,
                        dataStability: 15.78
                ),
                keywords: [keyword3],
                concept: concepts[1],
                project: projectB
        )

        [item1, item2]*.save()
    }

}
