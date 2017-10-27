/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import nl.thehyve.datashowcase.representation.ConceptRepresentation
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired

@Transactional(readOnly = true)
class ConceptService {

    @Autowired
    ModelMapper modelMapper

    List<ConceptRepresentation> getConcepts() {
        Concept.findAll().collect({ Concept concept ->
            modelMapper.map(concept, ConceptRepresentation)
        })
    }

}
