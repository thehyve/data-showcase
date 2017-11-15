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

    /**
     * Fetches all projects for items with filter criteria.
     * Supported criteria: conceptCodes, free text search query.
     * @return the list of projects as JSON.
     */
    def index() {
        def args = getGetOrPostParams()
        Set concepts = args.conceptCodes as Set
        def searchQuery = args.searchQuery as Map

        try {
            if (concepts || searchQuery) {
                respond projects: projectService.getProjects(concepts, searchQuery)
            } else {
                respond projects: projectService.projects
            }
        } catch (Exception e) {
            response.status = 400
            log.error 'An error occurred when fetching projects.', e
            respond error: "An error occurred when fetching projects. Error: $e.message"
        }
    }
    /**
     * Both GET and POST are supported for projects filtering
     * Parameters can be either passed as request params or request body (JSON)
     * @return a map of query parameters.
     */
    protected Map getGetOrPostParams() {
        if (request.method == "POST") {
            return (Map)request.JSON
        }
        return params.collectEntries { String k, v ->
            if (v instanceof Object[] || v instanceof List) {
                [k, v.collect { URLDecoder.decode(it, 'UTF-8') }]
            } else {
                [k, URLDecoder.decode(v, 'UTF-8')]
            }
        }
    }
}
