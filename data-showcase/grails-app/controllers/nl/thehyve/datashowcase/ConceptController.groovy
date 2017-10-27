/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import org.springframework.beans.factory.annotation.Autowired

class ConceptController {

	static responseFormats = ['json']

    @Autowired
    ConceptService conceptService

    def index() {
        respond concepts: conceptService.concepts
    }

}
