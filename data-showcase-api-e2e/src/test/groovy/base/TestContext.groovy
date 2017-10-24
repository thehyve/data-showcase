/*
 * Copyright (c) 2017  The Hyve B.V. 
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package base

import groovyx.net.http.HttpBuilder


class TestContext {
    private AuthAdapter authAdapter
    private HttpBuilder httpBuilder

    HttpBuilder getHttpBuilder() {
        if (!httpBuilder) {
            throw new MissingResourceException("no HttpBuilder configured", 'HttpBuilder', 'httpBuilder')
        }
        return httpBuilder
    }

    TestContext setHttpBuilder(HttpBuilder httpBuilder) {
        this.httpBuilder = httpBuilder
        return this
    }

    AuthAdapter getAuthAdapter() {
        if (!authAdapter) {
            throw new MissingResourceException("no AuthAdapter configured", 'AuthAdapter', 'authAdapter')
        }
        return authAdapter
    }

    TestContext setAuthAdapter(AuthAdapter authAdapter) {
        this.authAdapter = authAdapter
        return this
    }
}
