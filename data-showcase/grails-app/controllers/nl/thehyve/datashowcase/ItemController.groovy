/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import com.fasterxml.jackson.databind.ObjectMapper
import grails.converters.JSON
import org.grails.web.json.JSONArray
import org.springframework.beans.factory.annotation.Autowired

class ItemController {

	static responseFormats = ['json']

    @Autowired
    ItemService itemService

    /**
     * Fetches all items.
     * TODO description
     * @return the list of items as JSON.
     */
    def index() {

        Set concepts = parseParams(params.conceptCodes)
        Set projects = parseParams(params.projects)
        Set linesOfResearch = parseParams(params.linesOfResearch)
        Set searchQuery = parseParams(params.searchQuery)

        response.status = 200
        response.contentType = 'application/json'
        response.characterEncoding = 'utf-8'
        Object value
        if (concepts || projects || linesOfResearch || searchQuery){
            value = [items: itemService.getItems(concepts, projects, linesOfResearch, searchQuery)]
        } else {
            value = [items: itemService.items]
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

    private static Set parseParams(String jsonString){
        try{
            JSONArray json = JSON.parse(jsonString)
            return json.collect{ "'" + it + "'"} as Set
        } catch (Exception e) {
            return null
        }
    }
}
