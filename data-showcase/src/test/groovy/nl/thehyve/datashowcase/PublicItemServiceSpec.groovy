/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import grails.testing.mixin.integration.Integration
import groovy.util.logging.Slf4j
import org.grails.web.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional
import spock.lang.Requires
import spock.lang.Specification

import static org.hamcrest.CoreMatchers.hasItem
import static spock.util.matcher.HamcrestSupport.that

@Slf4j
@Integration
@Transactional
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

    @Requires({ -> Environment.grailsEnvironmentIn(Constants.PUBLIC_ENVIRONMENTS)})
    void "test fetching all items"() {
        given:
            setupData()
        when:
            log.info "Running test ..."
            def items = itemService.items
        then: "2 items being returned"
            items.size() == 2
            items*.name == ['ageA', 'heightB']
            items*.labelLong == ['Age at time of survey', 'Height at time of survey']
            items*.project == ['Project A', 'Project B']
            items*.itemPath == ['/Personal information/Basic information/Age', '/Personal information/Extended information/Height']
            that(items*.concept, hasItem('age'))
    }

    @Requires({ -> Environment.grailsEnvironmentIn(Constants.PUBLIC_ENVIRONMENTS)})
    void "test free text filter"() {
        given:
            setupData()
        when:
            JSONObject searchQuery = ["type":"string","value":"ageA"]
            def items = itemService.getItems([] as Set, [] as Set, searchQuery)

        then:
            items.size() == 1
            items*.name == ['ageA']
    }

}
