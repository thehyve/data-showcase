/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import grails.testing.mixin.integration.Integration
import grails.web.databinding.DataBinder
import groovy.util.logging.Slf4j
import nl.thehyve.datashowcase.representation.SearchQueryRepresentation
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

    static class SearchQueryBinder implements DataBinder {}

    static final searchQueryBinder = new SearchQueryBinder()

    static SearchQueryRepresentation parseQuery(final Map values) {
        def searchQuery = new SearchQueryRepresentation()
        searchQueryBinder.bindData(searchQuery, values)
        return searchQuery
    }

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
            def items = itemService.getItems(0, 9999, 'asc', 'name')
        then: "2 items being returned"
            items.size() == 2
            items*.name == ['ageA', 'heightB']
            items*.labelLong == ['Age at time of survey', 'Height at time of survey']
            items*.project == ['Project A', 'Project B']
            items*.itemPath == ['/Personal information/Basic information/Age', '/Personal information/Extended information/Height']
            that(items*.concept, hasItem('age'))
    }

    @Requires({ -> Environment.grailsEnvironmentIn(Constants.PUBLIC_ENVIRONMENTS) })
    void "test free text filter"() {
        given:
        int firstResult = 0
        int maxResults = 9999
        String order = 'asc'
        String propertyName = 'name'
        setupData()
        SearchQueryRepresentation searchQuery

        when: "Filter on single word without field and operator specified"
            searchQuery = parseQuery(["type": "string", "value": "ageA"])
            def items = itemService.getItems(firstResult, maxResults, order, propertyName, [] as Set, [] as Set, searchQuery)
        then:
            items.size() == 1
            items*.name == ['ageA']

        when: "Filter on words conjunction (OR) without field and operator specified"
            searchQuery = parseQuery(["type": "or", "values": [
                    ["type": "string", "value": "ageA"],
                    ["type": "string", "value": "heightB"]
            ]])
            items = itemService.getItems(firstResult, maxResults, order, propertyName, [] as Set, [] as Set, searchQuery)
        then:
            items.size() == 2
            items*.name as Set == ['ageA', 'heightB'] as Set

        when: "Filter on single word without field, operator (LIKE) is specified"
            searchQuery = parseQuery(["type"  : "like",
                           "values": [
                                   ["type": "string", "value": "a_e%"]
                           ]])
            items = itemService.getItems(firstResult, maxResults, order, propertyName, [] as Set, [] as Set, searchQuery)
        then:
            items.size() == 1
            items*.name == ['ageA']

        when: "Filter on single word with specified list of fields and operator ('keyword' IN '[<values>]')"
            searchQuery = parseQuery(["type": "in", "value": "keywords", "values": [
                    ["type": "string", "value": "Personal information"],
                    ["type": "string", "value": "Family related"]]
            ])
            items = itemService.getItems(firstResult, maxResults, order, propertyName, [] as Set, [] as Set, searchQuery)
        then:
            items.size() == 2
            items*.name as Set == ['ageA', 'heightB'] as Set

        when: "Filter on words disjunction (AND) and '=' operator ('field1=val1 OR field2=val2')"
            searchQuery = parseQuery(["type": "and", "values": [
                    ["type": "=", "value": "name", "values": [
                            ["type": "string", "value": "ageA"]
                    ]],
                    ["type": "=", "value": "label", "values": [
                        ["type": "string", "value": "ageB"]
                    ]]
            ]])
            items = itemService.getItems(firstResult, maxResults, order, propertyName, [] as Set, [] as Set, searchQuery)
        then:
            items.size() == 0

        when: "Invalid field name specified"
            def invalidProperty = "test_field"
            searchQuery = parseQuery(["type": "=", "value": invalidProperty, "values": [
                    ["type": "string", "value": "value"]
            ]])
            itemService.getItems(firstResult, maxResults, order, propertyName, [] as Set, [] as Set, searchQuery)
        then: "Exception is thrown"
            IllegalArgumentException ex = thrown()
            ex.message == "Unsupported property: ${invalidProperty}."

        when: "Invalid operator specified"
            def invalidOperator = "~"
            searchQuery = parseQuery(["type": invalidOperator, "value": "label", "values": [
                    ["type": "string", "value": "value"]
            ]])
            itemService.getItems(firstResult, maxResults, order, propertyName, [] as Set, [] as Set, searchQuery)
        then: "Exception is thrown"
            IllegalArgumentException ex2 = thrown()
            ex2.message == "Unsupported type: ${invalidOperator}."

        when: "Brackets are used in junction query"
            // 'name = "ageA" OR (name = "heightA" AND label = "height")'
            def searchQuery1 = parseQuery(["type": "or", "values": [
                    ["type": "=", "value": "name", "values": [
                            ["type": "string", "value": "ageA"]
                    ]],
                    ["type": "and", "values": [
                            ["type": "=", "value": "name", "values": [
                                ["type": "string", "value": "heightB"]
                            ]],
                            ["type": "=", "value": "labelNl", "values": [
                                ["type": "string", "value": "hoogte"]
                            ]]
                    ]]
            ]])

            // '(name = "ageA" OR name = "heightA") AND label = "height"'
            def searchQuery2 = parseQuery(["type": "and", "values": [
                    ["type": "or", "values": [
                            ["type": "=", "value": "name", "values": [
                                    ["type": "string", "value": "ageA"]
                            ]],
                            ["type": "=", "value": "name", "values": [
                                    ["type": "string", "value": "heightB"]
                            ]]
                    ]],
                    ["type": "=", "value": "labelNl", "values": [
                        ["type": "string", "value": "hoogte"]
                    ]]
            ]])
            def itemsForQuery1 = itemService.getItems(firstResult, maxResults, order, propertyName, [] as Set, [] as Set, searchQuery1)
            def itemsForQuery2 = itemService.getItems(firstResult, maxResults, order, propertyName, [] as Set, [] as Set, searchQuery2)
        then: "Results are different, depending on the distribution of brackets"
            itemsForQuery1 != itemsForQuery2
            itemsForQuery1.size() == 2
            itemsForQuery2.size() == 1
    }

}
