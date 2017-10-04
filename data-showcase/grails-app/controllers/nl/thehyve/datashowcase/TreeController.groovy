/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import org.springframework.beans.factory.annotation.Autowired

class TreeController {
	static responseFormats = ['json']

    @Autowired
    TreeService treeService
	
    def index() {
        respond tree_nodes: treeService.nodes
    }
}
