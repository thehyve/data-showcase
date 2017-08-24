package tests.rest

import base.RESTSpec
import spock.lang.Ignore

class ItemsSpec extends RESTSpec {

    @Ignore
    def "get test"() {
        given:
        get([path: '/api/test/clearDatabase'])

        when:
        def response = get([path: '/api/items'])

        then:
        println(response)
    }
}
