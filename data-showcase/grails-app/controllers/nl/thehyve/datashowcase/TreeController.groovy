/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.beans.factory.annotation.Autowired

class TreeController {
	static responseFormats = ['json']

    @Autowired
    TreeService treeService
	
    def index() {
        response.status = 200
        response.contentType = 'application/json'
        response.characterEncoding = 'utf-8'
        new ObjectMapper().writeValue(response.outputStream, [tree_nodes: treeService.nodes])
    }
}
