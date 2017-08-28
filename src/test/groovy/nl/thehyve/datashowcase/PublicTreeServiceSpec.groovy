package nl.thehyve.datashowcase

import grails.testing.mixin.integration.Integration
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional
import spock.lang.Requires
import spock.lang.Specification

@Slf4j
@Integration
@Transactional
class PublicTreeServiceSpec extends Specification {

    @Autowired
    TreeService treeService

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

    @Requires({ -> Environment.grailsEnvironmentIn(Constants.PUBLIC_ENVIRONMENTS)})
    void "test fetching all tree nodes"() {
        given:
            setupData()
        when:
            log.info "Running test ..."
            def nodes = treeService.nodes
        then: "1 node being returned with 1 child node"
            nodes.size() == 1
            nodes[0].children.size() == 1
            nodes[0].accumulativeItemCount == nodes[0].itemCount + nodes[0].children.sum { it.accumulativeItemCount }
    }

}
