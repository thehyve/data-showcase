package tests.rest

import base.RESTSpec

class DataImportSpec extends RESTSpec {

    def "upload data with invalid requestToken"() {
        given:
        def env = get([path: '/api/environment'])
        assert env['grailsEnvironment'] == 'test'
        assert env['environment'] == 'public'

        get([path: '/api/test/clearDatabase'])

        when:
        def file = null
        //file = new GrailsMockMultipartFile('testFile', 'test file contents'.bytes)
        def request = [
                path: 'api/data_import/upload',
                body: toJSON([
                        file        : file,
                        requestToken: null
                ])
        ]
        def response = post(request)

        then:
        assert response.status == 401
    }
}
