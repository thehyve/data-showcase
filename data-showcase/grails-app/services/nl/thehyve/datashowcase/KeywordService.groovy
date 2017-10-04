/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired

@Transactional(readOnly = true)
class KeywordService {

    @Autowired
    ModelMapper modelMapper

    List<String> getKeywords() {
        Keyword.findAll().collect({
            it.keyword
        })
    }

}
