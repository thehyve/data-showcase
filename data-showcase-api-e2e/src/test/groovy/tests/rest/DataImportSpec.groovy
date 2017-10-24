/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package tests.rest

import base.RESTSpec

class DataImportSpec extends RESTSpec {

    def "upload data with invalid requestToken"() {
        given:
        def env = get([path: '/api/environment'])
        assert env['grailsEnvironment'] == 'test'
        assert env['environment'] == 'Public'

        get([path: '/api/test/clearDatabase'])

        when:
        def file = null
        //file = new GrailsMockMultipartFile('testFile', 'test file contents'.bytes)
        def request = [
                path: '/api/data_import/upload',
                body: toJSON([
                        file        : file,
                        requestToken: null
                ]),
                statusCode: 401
        ]
        def response = post(request)

        then:
        assert response.error == 'requestToken is required to upload the data'
    }
}
