/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import org.springframework.beans.factory.annotation.Autowired

class TestController {

	static responseFormats = ['json']

    @Autowired
    DataService dataService

    @Autowired
    TestService testService

    def clearDatabase() {
        dataService.clearDatabase()
        dataService.clearCaches()
        response.status = 200
    }

    def createInternalData() {
        testService.createRandomInternalTestData()
        dataService.clearCaches()
        response.status = 200
    }

    def createPublicData() {
        testService.createPublicTestData()
        dataService.clearCaches()
        response.status = 200
    }

}
