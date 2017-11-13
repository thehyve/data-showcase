/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import com.fasterxml.jackson.databind.ObjectMapper
import grails.converters.JSON
import org.grails.web.json.JSONArray
import org.grails.web.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired

class ItemController {

	static responseFormats = ['json']

    @Autowired
    ItemService itemService

    /**
     * Fetches all items with filter criteria.
     * Supported criteria: conceptCodes, projects, free text search query.
     * @return the list of items as JSON.
     */
    def index() {
        def args = getGetOrPostParams()
        Set concepts = args.conceptCodes as Set
        Set projects =  args.projects as Set
        def searchQuery = args.searchQuery as Map

        response.status = 200
        response.contentType = 'application/json'
        response.characterEncoding = 'utf-8'
        Object value
        try {
            if (concepts || projects || searchQuery) {
                value = [items: itemService.getItems(concepts, projects, searchQuery)]
            } else {
                value = [items: itemService.items]
            }
        } catch (Exception e) {
            response.status = 400
            log.error 'An error occurred when fetching items.', e
            respond error: "An error occurred when fetching items. Error: $e.message"
            return
        }
        new ObjectMapper().writeValue(response.outputStream, value)
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

    /**
     * Both GET and POST are supported for items filtering
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
