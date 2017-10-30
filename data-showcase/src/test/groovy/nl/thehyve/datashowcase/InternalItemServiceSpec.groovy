/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import grails.testing.mixin.integration.Integration
import groovy.util.logging.Slf4j
import nl.thehyve.datashowcase.representation.InternalItemRepresentation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional
import spock.lang.Requires
import spock.lang.Specification

import static org.hamcrest.CoreMatchers.*
import static spock.util.matcher.HamcrestMatchers.*
import static spock.util.matcher.HamcrestSupport.that

@Slf4j
@Integration
@Transactional
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

    @Requires({ -> Environment.grailsEnvironmentIn(Constants.INTERNAL_ENVIRONMENTS)})
    void "test fetching all items"() {
        given:
            setupData()
        when:
            log.info "Running test ..."
            List<InternalItemRepresentation> items = itemService.items.collect {
                itemService.getItem(it.id) as InternalItemRepresentation
            }
            def maxValues = items*.summary.maxValue as List<Double>
        then: "2 items being returned, age and height, both public and internal, including aggregate values"
            items.size() == 8 + 20 + 9
            items*.labelLong as Set == ['Age at time of survey', 'Height at time of survey', 'Weight (kg)'] as Set
            items*.publicItem as Set == [true, false] as Set
            items*.itemPath as Set == [
                    '/Personal information/Basic information/Age',
                    '/Personal information/Extended information/Height',
                    '/Personal information/Basic information/Weight'
            ] as Set
            that(maxValues, hasItem(
                    closeTo(99, 0.1)
            ))
    }
}
