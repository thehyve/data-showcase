package nl.thehyve.datashowcase

import org.springframework.beans.factory.annotation.Autowired

class TestController {

	static responseFormats = ['json']

    @Autowired
    DataService dataService

    def clearDatabase() {
        dataService.clearDatabase()
    }

}
