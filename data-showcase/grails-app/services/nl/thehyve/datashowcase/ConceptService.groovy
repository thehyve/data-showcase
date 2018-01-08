/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import grails.plugin.cache.CacheEvict
import grails.plugin.cache.Cacheable
import nl.thehyve.datashowcase.representation.ConceptRepresentation
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired

@Transactional(readOnly = true)
class ConceptService {

    @Autowired
    ModelMapper modelMapper

    @Cacheable('concepts')
    List<ConceptRepresentation> getConcepts() {
        Concept.findAll().collect({ Concept concept ->
            modelMapper.map(concept, ConceptRepresentation)
        })
    }

    @CacheEvict(value = 'concepts', allEntries = true)
    void clearConceptsCache() {
        log.info "Clear concepts cache."
    }

}
