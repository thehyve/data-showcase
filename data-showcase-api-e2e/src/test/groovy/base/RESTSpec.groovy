/* (c) Copyright 2017, tranSMART Foundation, Inc. */

package base

import config.Config
import spock.lang.Shared
import spock.lang.Specification

import static config.Config.BASE_URL
import static groovyx.net.http.HttpBuilder.configure

abstract class RESTSpec extends Specification {

    @Shared
    private TestContext testContext = new TestContext()
            .setHttpBuilder(configure { request.uri = BASE_URL })
            .setAuthAdapter(Config.authAdapter)

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
