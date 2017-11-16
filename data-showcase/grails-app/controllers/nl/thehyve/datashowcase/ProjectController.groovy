/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import nl.thehyve.datashowcase.representation.SearchQueryRepresentation
import org.springframework.beans.factory.annotation.Autowired

class ProjectController {

	static responseFormats = ['json']

    @Autowired
    ProjectService projectService

    /**
     * Fetches all projects
     */
    def index() {
        respond projects: projectService.projects
    }

    /**
     * Fetches all projects for items with filter criteria.
     * Supported criteria: conceptCodes, free text search query.
     * @return the list of projects as JSON.
     */
    def search() {
        def args = request.JSON as Map
        Set concepts = args.conceptCodes as Set
        log.info "Query input: ${args.searchQuery}"
        def searchQuery = new SearchQueryRepresentation()
        bindData(searchQuery, args.searchQuery)

        try {
            respond projects: projectService.getProjects(concepts, searchQuery)
        } catch (Exception e) {
            response.status = 400
            log.error 'An error occurred when fetching projects.', e
            respond error: "An error occurred when fetching projects. Error: $e.message"
        }
    }

}
