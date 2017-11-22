/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package tests.rest

import base.RESTSpec
import static config.Config.TOKEN
import static groovyx.net.http.MultipartContent.multipart

class DataImportSpec extends RESTSpec {

    def "upload valid data"() {
        given:
        def env = get([path: '/api/environment'])
        assert env['grailsEnvironment'] == 'test'
        assert env['environment'] == 'Public'
        get([path: '/api/test/clearDatabase'])

        when:
        def file = new File(getClass().getResource("/test.json").toURI())
        def requestToken = TOKEN
        def request = [
                path       : '/api/data_import/upload',
                contentType: 'multipart/form-data',
                body       : multipart {
                    field 'requestToken', requestToken
                    part 'file', 'test.json', 'text/plain', file
                },
                statusCode : 200
        ]
        def response = post(request)

        then:
        assert response.message == "Data successfully uploaded"
    }

    def "upload data with invalid requestToken"() {
        given:
        def env = get([path: '/api/environment'])
        assert env['grailsEnvironment'] == 'test'
        assert env['environment'] == 'Public'

        get([path: '/api/test/clearDatabase'])

        when:
        def requestToken = null
        def file = new File(getClass().getResource("/test.json").toURI())
        def request = [
                path       : '/api/data_import/upload',
                contentType: 'multipart/form-data',
                body       : multipart {
                    field 'requestToken', requestToken
                    part 'file', 'test.json', 'text/plain', file
                },
                statusCode : 401
        ]
        def response = post(request)

        then:
        assert response.error == 'requestToken is required to upload the data'
    }

    def "upload invalid data"() {
        given:
        def env = get([path: '/api/environment'])
        assert env['grailsEnvironment'] == 'test'
        assert env['environment'] == 'Public'
        get([path: '/api/test/clearDatabase'])

        when:
        // File with invalid data:
        // project names not unique, concept code of the first item is missing
        def file = new File(getClass().getResource("/test_invalid.json").toURI())
        def requestToken = TOKEN
        def request = [
                path       : '/api/data_import/upload',
                contentType: 'multipart/form-data',
                body       : multipart {
                    field 'requestToken', requestToken
                    part 'file', 'test.json', 'text/plain', file
                },
                statusCode : 400
        ]
        def response = post(request)

        then:
        assert response.status == 400
        assert response.error == "Bad request"
    }

    def "upload empty file"() {
        given:
        def env = get([path: '/api/environment'])
        assert env['grailsEnvironment'] == 'test'
        assert env['environment'] == 'Public'
        get([path: '/api/test/clearDatabase'])

        when:
        def file = new File(getClass().getResource("/test_invalid.json").toURI())
        def requestToken = TOKEN
        def request = [
                path       : '/api/data_import/upload',
                contentType: 'multipart/form-data',
                body       : multipart {
                    field 'requestToken', requestToken
                    part 'file', 'test.json', 'text/plain', file
                },
                statusCode : 400
        ]
        def response = post(request)

        then:
        assert response.status == 400
        assert response.error == "Bad request"
    }

}
