/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import org.springframework.beans.factory.annotation.Autowired

class ResearchLineController {

	static responseFormats = ['json']

    @Autowired
    ResearchLineService researchLineService

    def index() {
        respond linesOfResearch: researchLineService.linesOfResearch
    }

}
