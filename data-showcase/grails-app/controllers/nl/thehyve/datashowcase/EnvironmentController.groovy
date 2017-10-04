/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import org.springframework.beans.factory.annotation.Autowired

class EnvironmentController {

    static responseFormats = ['json']

    @Autowired
    Environment dataShowcaseEnvironment

    def index() {
        respond environment: dataShowcaseEnvironment.currentEnvironment,
            grailsEnvironment: dataShowcaseEnvironment.grailsEnvironment,
            application: dataShowcaseEnvironment.applicationName,
            version: dataShowcaseEnvironment.applicationVersion
    }

}
