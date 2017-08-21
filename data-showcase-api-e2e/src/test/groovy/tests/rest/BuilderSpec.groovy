package tests.rest

import base.RESTSpec

class BuilderSpec extends RESTSpec {

    def "get test"() {
        when:
        def response = get([
                path: '/api/',
        ])

        then:
        println(response)
    }
}
