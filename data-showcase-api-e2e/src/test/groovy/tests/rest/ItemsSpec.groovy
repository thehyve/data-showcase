/*
 * Copyright (c) 2017  The Hyve B.V. 
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package tests.rest

import base.RESTSpec

class ItemsSpec extends RESTSpec {

    def "get items"() {
        given:
        def env = get([path: '/api/environment'])
        assert env['grailsEnvironment'] == 'test'
        assert env['environment'] == 'Public'

        get([path: '/api/test/clearDatabase'])
        get([path: '/api/test/createPublicData'])

        when:
        def response = get([path: '/api/items'])

        then:
        println(response)
    }
}
