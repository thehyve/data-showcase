package nl.thehyve.datashowcase

import grails.util.Environment
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.CommandLineRunner

class TestDataService implements CommandLineRunner {

    @Autowired
    TestService testService

    @Override
    void run(String... args) throws Exception {
        Environment.executeForCurrentEnvironment {
            development {
                log.info "Creating test data for environment ${Environment.current} ..."
                testService.createPublicTestData()
            }
            developmentInternal {
                log.info "Creating test data for environment ${Environment.current} ..."
                testService.createInternalTestData()
            }
        }
    }

}
