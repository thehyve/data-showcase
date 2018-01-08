/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import org.grails.core.util.StopWatch
import org.hibernate.Criteria
import org.hibernate.SessionFactory
import org.hibernate.criterion.Order
import org.hibernate.criterion.Projections
import org.hibernate.criterion.Restrictions
import org.hibernate.sql.JoinType
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired

@Transactional(readOnly = true)
class KeywordService {

    @Autowired
    ModelMapper modelMapper

    SessionFactory sessionFactory

    List<String> getKeywords() {
        Keyword.findAll().collect({
            it.keyword
        })
    }

    List<String> getKeywordsForConcept(String conceptCode) {
        def stopWatch = new StopWatch("Fetch keywords for concept: $conceptCode.")
        stopWatch.start('Retrieve from database')
        def session = sessionFactory.openSession()

        Criteria criteria = session.createCriteria(Concept, "c")
                .createAlias("c.keywords", "k", JoinType.LEFT_OUTER_JOIN)
                .setProjection(Projections.property("k.keyword").as("keyword"))
                .add( Restrictions.eq('c.conceptCode', conceptCode))
        criteria.setResultTransformer(Criteria.ALIAS_TO_ENTITY_MAP)
        criteria.addOrder(Order.asc("keyword"))
        def keywords = criteria.list() as List<String>

        stopWatch.stop()

        log.info "${keywords.size()} keywords fetched for concept: $conceptCode.\n${stopWatch.prettyPrint()}"
        keywords.collect{it.keyword}
    }

}
