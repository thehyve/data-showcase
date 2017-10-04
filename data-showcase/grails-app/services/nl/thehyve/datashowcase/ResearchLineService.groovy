/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional

@Transactional(readOnly = true)
class ResearchLineService {

    List<String> getLinesOfResearch() {
        LineOfResearch.findAll().collect({
            it.name
        })
    }

}
