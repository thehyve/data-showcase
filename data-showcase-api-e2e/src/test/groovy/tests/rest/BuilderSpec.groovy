package tests.rest

import base.RESTSpec
import spock.lang.Ignore

class BuilderSpec extends RESTSpec {

    @Ignore
    def "get test"() {
        when:
        def response = get([
                path: '/api/',
        ])

        then:
        println(response)
    }
}
