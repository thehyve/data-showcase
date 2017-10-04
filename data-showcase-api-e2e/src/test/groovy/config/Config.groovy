/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package config

import base.TestContext

import static groovyx.net.http.HttpBuilder.configure

class Config {

    //$ gradle -DbaseUrl=http://some.domain.net/ test
    public static
    final String BASE_URL = System.getProperty('baseUrl') != null ? System.getProperty('baseUrl') : 'http://localhost:8080/'

    // Configure the default TestContext. This is shared between all tests unless it is replaced by a testClass
    public static final TestContext testContext = new TestContext().setHttpBuilder(configure {
        request.uri = BASE_URL

        // custom parsers
//        response.parser(ContentTypeFor.PROTOBUF) { ChainedHttpConfig cfg, FromServer fs ->
//            // add method for parsing here
//        }

        // custom interceptor
//        execution.interceptor(GET) { cfg, fx ->
//            // before request
//            fx.apply(cfg)
//            // after request
//            // data returned from this method the the responce returned from the request
//            // do not change the data unless applicable for all requests
//        }
    }).setAuthAdapter(new BasicAuthAdapter())
    // set an authentication adapter if needed. look at BasicAuthAdapter for an example

    //settings
    public static final boolean AUTH_NEEDED = false
    public static final String DEFAULT_USER = 'default'
}
