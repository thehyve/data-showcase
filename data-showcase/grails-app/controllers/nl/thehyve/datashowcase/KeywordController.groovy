/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import org.springframework.beans.factory.annotation.Autowired

class KeywordController {

	static responseFormats = ['json']

    @Autowired
    KeywordService keywordService

    def index() {
        respond keywords: keywordService.keywords
    }

}
