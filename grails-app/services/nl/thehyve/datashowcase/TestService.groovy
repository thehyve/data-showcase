package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import nl.thehyve.datashowcase.enumeration.VariableType
import org.apache.commons.lang.ArrayUtils

import static nl.thehyve.datashowcase.Environment.checkGrailsEnvironment

@Transactional
class TestService {

    def concepts
    def nodes
    Keyword testKeyword
    Project testProject
    LineOfResearch testLineOfResearch

    /**
     * Creates and stores test domains.
     */
    def createConceptTestData() {
        checkGrailsEnvironment(Constants.DEV_ENVIRONMENTS, Constants.TEST_ENVIRONMENTS)

        def conceptAge = new Concept(
                conceptCode: 'age',
                label: 'Age', labelLong: 'Age at time of survey',
                labelNl: 'Leeftijd', labelNlLong: 'Leeftijd van het onderwerp',
                variableType: VariableType.Numerical)
        def conceptWeight = new Concept(
                conceptCode: 'weight',
                label: 'Weight', labelLong: 'Weight (kg)',
                labelNl: 'Gewicht', labelNlLong: 'Gewicht (kg)',
                variableType: VariableType.Numerical)
        def conceptHeight = new Concept(
                conceptCode: 'height',
                labelNl: 'hoogte', labelNlLong: 'Hoogte van het onderwerp',
                label: 'Height', labelLong: 'Height at time of survey',
                variableType: VariableType.Numerical)
        concepts = [conceptAge, conceptHeight]
        def domain1 = new TreeNode(null, 'Personal information')
        def subdomain11 = new TreeNode(domain1, 'Basic information')
        def conceptNodeAge = new TreeNode(subdomain11, conceptAge)
        def conceptNodeWeight = new TreeNode(subdomain11, conceptWeight)
        def subdomain12 = new TreeNode(domain1, 'Extended information')
        def conceptNodeHeight = new TreeNode(subdomain12, conceptHeight)
        def subdomain121 = new TreeNode(subdomain12, 'Some details')
        def domain2 = new TreeNode(null, 'Other information')
        def subdomain2 = new TreeNode(domain2, 'Some information')

        nodes = [domain1, subdomain11, conceptNodeAge, conceptNodeWeight, subdomain12, conceptNodeHeight, subdomain121, domain2, subdomain2]
    }

    def createItems(int number,
                    String label,
                    Project project,
                    TreeNode node,
                    Keyword[] keywords,
                    Summary[] summaries,
                    boolean isPublic) {
        def items = []
        for (int i = 1; i <= number; i++) {
            items.add(new Item(
                    name: label + i,
                    publicItem: isPublic,
                    keywords: keywords,
                    concept: node.concept,
                    itemPath: node.path,
                    project: project,
                    summary: summaries[i - 1]
            ))
        }
        items
    }

    def createSummary(int number, double minValue, double maxValue, Value[] values) {
        int patientCount = rand(100, 200)
        def summaries = []
        for (int i = 0; i < number; i++) {
            def summary = new Summary(
                    patientCount: patientCount,
                    observationCount: rand(patientCount, patientCount + 50),
                    dataStability: 'Approved',
                    minValue: minValue,
                    avgValue: rand((int) minValue, (int) maxValue),
                    maxValue: maxValue,
                    stdDevValue: rand(1000, 2000) / 100
            )

            if (values) {
                values.each { summary.addToValues(it) }
            } else {
                summary.addToValues(new Value(label: 'Test label 1', value: '<= 10', frequency: 67))
                        .addToValues(new Value(label: 'Test label 2', value: '> 10', frequency: 52))
            }
            summaries.add(summary)
        }
        summaries
    }

    /**
     * Creates and stores test objects for the internal environment (including
     * non-public items and extensive summary data).
     */
    def createInternalTestData() {
        checkGrailsEnvironment(Constants.INTERNAL_ENVIRONMENTS)

        createConceptTestData()

        def researchLine1 = new LineOfResearch(name: 'Research line 1')
        def researchLine2 = new LineOfResearch(name: 'Research line 2')

        def projectA = new Project(name: 'Project A', description: 'First test project', lineOfResearch: researchLine1)
        def projectB = new Project(name: 'Project B', description: 'Second test project', lineOfResearch: researchLine2)
        def projectC = new Project(name: 'Project C', description: 'Third test project', lineOfResearch: researchLine2)

        [researchLine1, researchLine2, projectA, projectB, projectC]*.save(flush: true)

        def keyword1 = new Keyword(keyword: 'Personal information')
        def keyword2 = new Keyword(keyword: 'Family related')
        def keyword3 = new Keyword(keyword: 'Body characteristics')
        def keyword4 = new Keyword(keyword: 'Demographics')
        def keyword5 = new Keyword(keyword: 'Physical Health')
        def keyword6 = new Keyword(keyword: 'Administration')
        def keyword7 = new Keyword(keyword: 'Health Behaviors')

        [keyword1, keyword2, keyword3, keyword4, keyword5, keyword6, keyword7]*.save(flush: true)

        Value[] values = [
                new Value(label: 'Young', value: '<= 60', frequency: 30),
                new Value(label: 'Old', value: '> 60', frequency: 60)
        ]

        Summary[] ageSummaries = createSummary(8, 12, 99, values)

        Item[] ageItems = createItems(8, "age", projectA, nodes[2],
                [keyword1, keyword4, keyword7, keyword6] as Keyword[],
                ageSummaries,
                true)

        Summary[] heightSummaries = createSummary(20, 140, 220, values)
        Item[] heightItems = createItems(20, "height", projectB, nodes[5],
                [keyword1, keyword2, keyword3, keyword7] as Keyword[],
                heightSummaries,
                true)

        Summary[] weightSummaries = createSummary(9, 55, 230, values)
        Item[] weightItems = createItems(9, "weight", projectC, nodes[3],
                [keyword1, keyword3, keyword7, keyword5] as Keyword[],
                weightSummaries,
                true)

        createRandomData()
        concepts*.save(flush: true)
        nodes*.save(flush: true)

        nodes.each { node ->
            log.info "Created node ${node.label}, parent: ${node.parent?.path}, path: ${node.path}"
        }
        ageItems*.save(flush: true)
        heightItems*.save(flush: true)
        weightItems*.save(flush: true)
    }

    /**
     * Creates and stores test objects for the public environment (with
     * only public items and limited summary data).
     */
    def createPublicTestData() {
        checkGrailsEnvironment(Constants.PUBLIC_ENVIRONMENTS)

        createConceptTestData()
        concepts*.save(flush: true)
        nodes*.save(flush: true)
        nodes.each { node ->
            log.info "Created node ${node.label}, parent: ${node.parent?.path}, path: ${node.path}"
        }

        def researchLine1 = new LineOfResearch(name: 'Research line 1')
        def researchLine2 = new LineOfResearch(name: 'Research line 2')

        def projectA = new Project(name: 'Project A', description: 'First test project', lineOfResearch: researchLine1)
        def projectB = new Project(name: 'Project B', description: 'Second test project', lineOfResearch: researchLine2)

        [researchLine1, researchLine2, projectA, projectB]*.save()

        def keyword1 = new Keyword(keyword: 'Personal information')
        def keyword2 = new Keyword(keyword: 'Family related')
        def keyword3 = new Keyword(keyword: 'Body characteristics')

        [keyword1, keyword2, keyword3]*.save(flush: true)

        def item1 = new Item(
                name: 'ageA',
                itemType: VariableType.Numerical,
                publicItem: true,
                keywords: [keyword1, keyword3],
                concept: concepts[0],
                itemPath: nodes[2].path,
                project: projectA,
                summary: new Summary(
                        patientCount: 100,
                        observationCount: 102,
                        dataStability: 'Committed')
                        .addToValues(new Value(label: 'Young', value: '<= 60'))
                        .addToValues(new Value(label: 'Old', value: '> 60'))
        )

        def item2 = new Item(
                name: 'heightB',
                itemType: VariableType.Numerical,
                publicItem: true,
                constraintJson: '{"type": "concept", "concept_cd": "height"}',
                summary: new Summary(
                        patientCount: 200,
                        observationCount: 402,
                        dataStability: 'Committed'
                ),
                keywords: [keyword3],
                concept: concepts[1],
                itemPath: nodes[4].path,
                project: projectB
        )

        [item1, item2]*.save(flush: true)

    }

    def createRandomData() {
        testKeyword = new Keyword(keyword: 'Test keyword')
        testLineOfResearch = new LineOfResearch(name: 'Test research line')
        testProject = new Project(name: 'Project', description: 'Test project', lineOfResearch: testLineOfResearch)
        [testLineOfResearch, testProject, testKeyword]*.save()

        int[] domainPerLevel = [10, 2, 3, 2]
        TreeNode parent = null;
        createRandomDomain(parent, domainPerLevel)
    }

    def createRandomDomain(TreeNode parent, int[] number) {
        for (int i = 1; i <= number[0]; i++) {
            def newNumber = ArrayUtils.removeElement(number, number[0])
            def domain = new TreeNode(parent, parent ? parent.label + ".$i" : "Domain$i")
            nodes.add(domain)

            if (newNumber.length != 0) {
                createRandomDomain(domain, newNumber)
            } else {
                createRandomConceptNodeWithItems(domain)
            }
        }
    }

    def createRandomConceptNodeWithItems(TreeNode domain) {
        def concept = new Concept(
                conceptCode: "ConceptFor$domain.label",
                label: "ConceptFor$domain.label", labelLong: "ConceptFor$domain.label long description",
                labelNl: "NederlandsConceptVoor$domain.label", labelNlLong: "NederlandsConceptVoor$domain.label lange beschrijving",
                variableType: VariableType.Categorical)
        concepts.add(concept)
        def conceptNode = new TreeNode(domain, concept)
        nodes.add(conceptNode)

        Summary[] summaries = createSummary(8, 12, 99, null)
        Item[] items = createItems(3, concept.label + "Item", testProject, conceptNode, [testKeyword] as Keyword[],
                summaries, true)
        items*.save(flush: true)
    }

    double rand(int min, int max) {
        return Math.abs(new Random().nextInt() % max) + min
    }
}

