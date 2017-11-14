/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import com.fasterxml.jackson.databind.ObjectMapper
import nl.thehyve.datashowcase.representation.SearchQueryRepresentation
import org.springframework.beans.factory.annotation.Autowired

class ItemController {

	static responseFormats = ['json']

    @Autowired
    ItemService itemService

    /**
     * Fetches all items.
     * @return the list of items as JSON.
     */
    def index() {
        try {
            response.status = 200
            response.contentType = 'application/json'
            response.characterEncoding = 'utf-8'
            def data = [items: itemService.items]
            log.info "Writing ${data.items.size()} items ..."
            new ObjectMapper().writeValue(response.outputStream, data)
        } catch (Exception e) {
            response.status = 400
            log.error 'An error occurred when fetching items.', e
            respond error: "An error occurred when fetching items. Error: $e.message"
        }
    }

    /**
     * Fetches all items with filter criteria.
     * Supported criteria: conceptCodes, projects, free text search query.
     * @return the list of items as JSON.
     */
    def search() {
        try {
            def args = request.JSON as Map
            Set concepts = args.conceptCodes as Set
            Set projects =  args.projects as Set
            log.info "Query input: ${args.searchQuery}"
            def searchQuery = new SearchQueryRepresentation()
            bindData(searchQuery, args.searchQuery)

            response.status = 200
            response.contentType = 'application/json'
            response.characterEncoding = 'utf-8'

            def data = [items: itemService.getItems(concepts, projects, searchQuery)]
            new ObjectMapper().writeValue(response.outputStream, data)
        } catch (Exception e) {
            response.status = 400
            log.error 'An error occurred when fetching items.', e
            respond error: "An error occurred when fetching items. Error: $e.message"
        }
    }

    /**
     * Fetches the item with the id if it exists.
     *
     * @param id the id of the item.
     * @return the item as JSON.
     * @throws nl.thehyve.datashowcase.exception.ResourceNotFoundException
     * if the item does not exists.
     */
    def show(long id) {
        respond itemService.getItem(id)
    }

}
