/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import org.springframework.beans.factory.annotation.Autowired

class ProjectController {

	static responseFormats = ['json']

    @Autowired
    ProjectService projectService

    def index() {
        respond projects: projectService.projects
    }

}
