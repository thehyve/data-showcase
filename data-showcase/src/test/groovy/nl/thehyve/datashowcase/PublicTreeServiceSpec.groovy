/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

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
        then: "2 nodes being returned with child nodes"
            nodes.size() == 2
            nodes.find { it.label == 'Personal information' }.children.size() == 2
            nodes.find { it.label == 'Other information' }.children.size() == 1
            nodes.each { node ->
                node.accumulativeItemCount == node.itemCount + node.children.sum { it.accumulativeItemCount }
            }
    }

}
