/* (c) Copyright 2017, tranSMART Foundation, Inc. */

package base

import config.Config
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
}
