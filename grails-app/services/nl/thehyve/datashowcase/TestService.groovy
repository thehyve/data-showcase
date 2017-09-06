package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import nl.thehyve.datashowcase.enumeration.ItemType

import static nl.thehyve.datashowcase.Environment.checkGrailsEnvironment

@Transactional
class TestService {

    /**
     * Creates and stores test domains.
     */
    def createDomainTestData() {
        checkGrailsEnvironment(Constants.DEV_ENVIRONMENTS, Constants.TEST_ENVIRONMENTS)

        def domain1 = new TreeNode(null, 'PI', 'Personal information')
        def subdomain11 = new TreeNode(domain1, 'Basic', 'Basic information')
        def subdomain12 = new TreeNode(domain1, 'Extended', 'Extended information')
        def subdomain121 = new TreeNode(subdomain12, 'Details', 'Some details')
        def domain2 = new TreeNode(null, 'OI', 'Other information')
        def subdomain2 = new TreeNode(domain2, 'Some', 'Some information')
        def domains = [domain1, subdomain11, subdomain12, subdomain121, domain2, subdomain2]
        domains*.save()
        domains
    }

    /**
     * Creates and stores test objects for the internal environment (including
     * non-public items and extensive summary data).
     */
    def createInternalTestData() {
        checkGrailsEnvironment(Constants.INTERNAL_ENVIRONMENTS)

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
                name: 'ageA',
                label: 'age',
                labelLong: 'Age of the subject',
                itemType: ItemType.Numerical,
                publicItem: true,
                constraintJson: '{"type": "concept", "concept_cd": "age"}',
                keywords: [keyword1, keyword3],
                domain: domains[1],
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
                itemType: ItemType.Numerical,
                publicItem: true,
                constraintJson: '{"type": "concept", "concept_cd": "height"}',
                summary: new Summary(
                        patientCount: 200,
                        observationCount: 402,
                        dataStability: 15.78
                ),
                keywords: [keyword3],
                domain: null,
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
                name: 'ageA',
                label: 'age',
                labelLong: 'Age of the subject',
                itemType: ItemType.Numerical,
                publicItem: true,
                constraintJson: '{"type": "concept", "concept_cd": "age"}',
                keywords: [keyword1, keyword3],
                domain: domains[1],
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
                itemType: ItemType.Numerical,
                publicItem: true,
                constraintJson: '{"type": "concept", "concept_cd": "height"}',
                summary: new Summary(
                        patientCount: 200,
                        observationCount: 402,
                        dataStability: 15.78
                ),
                keywords: [keyword3],
                domain: domains[2],
                project: projectB
        )

        [item1, item2]*.save()
    }

}
