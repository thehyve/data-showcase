package nl.thehyve.datashowcase

import org.springframework.beans.factory.annotation.Autowired

class TestController {

	static responseFormats = ['json']

    @Autowired
    DataService dataService

    @Autowired
    TestService testService

    def clearDatabase() {
        dataService.clearDatabase()
    }

    def createInternalData() {
        testService.createInternalTestData()
    }

    def createPublicData() {
        testService.createPublicTestData()
    }

}
