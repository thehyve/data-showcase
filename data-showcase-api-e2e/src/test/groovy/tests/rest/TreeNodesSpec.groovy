package tests.rest

import base.RESTSpec

class TreeNodesSpec extends RESTSpec {

    def "get tree nodes"() {
        given:
        def env = get([path: '/api/environment'])
        assert env['grailsEnvironment'] == 'test'
        assert env['environment'] == 'Public'

        get([path: '/api/test/clearDatabase'])
        get([path: '/api/test/createPublicData'])

        when:
        def response = get([path: '/api/tree_nodes'])

        then:
        println(response)
    }
}
