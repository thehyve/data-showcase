package nl.thehyve.datashowcase

import grails.testing.mixin.integration.Integration
import grails.util.Environment
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import spock.lang.Requires
import spock.lang.Specification

import static org.hamcrest.CoreMatchers.hasItem
import static spock.util.matcher.HamcrestSupport.that

@Slf4j
@Integration
class PublicItemServiceSpec extends Specification {

    @Autowired
    ItemService itemService

    @Autowired
    DataService dataService

    @Autowired
    TestService testService

    def setupData() {
        log.info "Clear database ..."
        dataService.clearDatabase()
        log.info "Create public test data set ..."
        testService.createPublicTestData()
    }

    @Requires({ -> Environment.current.name == Constants.PUBLIC_TEST_ENVIRONMENT})
    void "test fetching all items"() {
        given:
            setupData()
        when:
            log.info "Running test ..."
            def items = itemService.getItems()
        then: "2 items being returned"
            items.size() == 2
            items*.name == ['ageA', 'heightB']
            items*.label == ['age', 'height']
            items*.project == ['Project A', 'Project B']
            that(items*.domain, hasItem('/PI/Basic'))
    }

}
