/*
 * Copyright (c) 2017  The Hyve B.V. 
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package base

import groovyx.net.http.HttpConfig.Request

interface AuthAdapter {
    void authenticate(Request request, String userID)
}