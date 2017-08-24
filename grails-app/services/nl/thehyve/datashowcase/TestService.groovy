package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import grails.util.Environment
import nl.thehyve.datashowcase.enumeration.ItemType
import nl.thehyve.datashowcase.exception.ConfigurationException

@Transactional
class TestService {

    def checkEnvironment(String ... allowedEnvironments) {
        if (!(Environment.current.name in allowedEnvironments)) {
            throw new ConfigurationException("Action not allowed in environment ${Environment.current}.")
        }
    }

    /**
     * Creates and stores test domains.
     */
    def createDomainTestData() {
        def subdomain1 = new TreeNode(
                name: 'Basic information',
                path: '/PI/Basic'
        )
        def domain1 = new TreeNode(
                name: 'Personal information',
                path: '/PI',
        )
                .addToChildren(subdomain1)
        def domains = [subdomain1, domain1]
        domains*.save()
        domains
    }

    /**
     * Creates and stores test objects for the internal environment (including
     * non-public items and extensive summary data).
     */
    def createInternalTestData() {
        checkEnvironment('testInternal', 'developmentInternal')

        def domains = createDomainTestData()

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
                label: 'age',
                labelLong: 'Age of the subject',
                itemType: ItemType.Numerical,
                publicItem: true,
                constraintJson: '{"type": "concept", "concept_cd": "age"}',
                keywords: [keyword1, keyword3],
                domain: domains[0],
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
        .addToProjects(projectA)
        .addToProjects(projectB)

        def item2 = new Item(
                label: 'height',
                labelLong: 'Height of the subject',
                itemType: ItemType.Numerical,
                publicItem: false,
                constraintJson: '{"type": "concept", "concept_cd": "height"}',
                summary: new Summary(
                        patientCount: 200,
                        observationCount: 402,
                        dataStability: 15.78
                ),
                keywords: [keyword3],
                domain: null
        )
        .addToProjects(projectA)

        [item1, item2]*.save()
    }

    /**
     * Creates and stores test objects for the public environment (with
     * only public items and limited summary data).
     */
    def createPublicTestData() {
        checkEnvironment('test', 'development')

        def domains = createDomainTestData()

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
                label: 'age',
                labelLong: 'Age of the subject',
                itemType: ItemType.Numerical,
                publicItem: true,
                constraintJson: '{"type": "concept", "concept_cd": "age"}',
                keywords: [keyword1, keyword3],
                domain: domains[0],
                summary: new Summary(
                        patientCount: 100,
                        observationCount: 102,
                        dataStability: 13.78)
                        .addToValues(new Value(label: 'Young', value: '<= 60'))
                        .addToValues(new Value(label: 'Old', value: '> 60'))
        )
        .addToProjects(projectA)
        .addToProjects(projectB)

        def item2 = new Item(
                label: 'height',
                labelLong: 'Height of the subject',
                itemType: ItemType.Numerical,
                publicItem: true,
                constraintJson: '{"type": "concept", "concept_cd": "height"}',
                summary: new Summary(
                        patientCount: 200,
                        observationCount: 402,
                        dataStability: 15.78
                ),
                keywords: [keyword3],
                domain: null
        )
        .addToProjects(projectA)

        [item1, item2]*.save()
    }

}
