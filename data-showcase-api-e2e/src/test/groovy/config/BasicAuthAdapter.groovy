/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package config

import base.AuthAdapter
import groovyx.net.http.HttpConfig

class BasicAuthAdapter implements AuthAdapter {

    private static HashMap<String, User> users = [:]

    BasicAuthAdapter() {
        users.put('default', new User('admin', 'admin'))
    }

    @Override
    void authenticate(HttpConfig.Request request, String userId) {
        User user = getUser(userId)
        request.auth.basic(user.username, user.password)
    }

    static User getUser(String userID) {
        if (!users.get(userID)) {
            throw new MissingResourceException("the user with id ${userID} is not definded in OauthAdapter.users", 'User', userID)
        }
        users.get(userID)
    }

    class User {
        String username
        String password

        User(String username, String password) {
            this.username = username
            this.password = password
        }
    }
}
