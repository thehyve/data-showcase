/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU General Public License
 *  (see accompanying file LICENSE).
 */

package base

import config.Config
import groovy.json.JsonBuilder
import spock.lang.Shared
import spock.lang.Specification

abstract class RESTSpec extends Specification {

    @Shared
    TestContext testContext = Config.testContext

    def delete(def requestMap) {
        RestHelper.delete(testContext, requestMap)
    }

    def put(def requestMap) {
        RestHelper.put(testContext, requestMap)
    }

    def post(def requestMap) {
        RestHelper.post(testContext, requestMap)
    }

    def get(def requestMap) {
        RestHelper.get(testContext, requestMap)
    }

    def toJSON(object){
        return new JsonBuilder(object).toString()
    }
}
