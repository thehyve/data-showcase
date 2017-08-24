package nl.thehyve.datashowcase

import grails.testing.mixin.integration.Integration
import grails.util.Environment
import groovy.util.logging.Slf4j
import nl.thehyve.datashowcase.representation.InternalItemRepresentation
import org.springframework.beans.factory.annotation.Autowired
import spock.lang.Requires
import spock.lang.Specification

import static org.hamcrest.CoreMatchers.*
import static spock.util.matcher.HamcrestMatchers.*
import static spock.util.matcher.HamcrestSupport.that

@Slf4j
@Integration
class InternalItemServiceSpec extends Specification {

    @Autowired
    ItemService itemService

    @Autowired
    DataService dataService

    @Autowired
    TestService testService

    void setupData() {
        log.info "Clear database ..."
        dataService.clearDatabase()
        log.info "Create internal test data set ..."
        testService.createInternalTestData()
    }

    @Requires({ -> Environment.current.name == Constants.INTERNAL_TEST_ENVIRONMENT})
    void "test fetching all items"() {
        given:
            setupData()
        when:
            log.info "Running test ..."
            List<InternalItemRepresentation> items = itemService.items.collect { it as InternalItemRepresentation }
            def maxValues = items*.summary.maxValue as List<Double>
        then: "2 items being returned, age and height, both public and internal, including aggregate values"
            items.size() == 2
            items*.label == ['age', 'height']
            items*.publicItem == [true, false]
            that(maxValues, hasItem(
                    closeTo(99, 0.1)
            ))
    }
}
