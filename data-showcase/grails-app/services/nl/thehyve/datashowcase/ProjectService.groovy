/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import groovy.transform.CompileStatic
import nl.thehyve.datashowcase.representation.ProjectRepresentation
import nl.thehyve.datashowcase.representation.SearchQueryRepresentation
import nl.thehyve.datashowcase.search.SearchCriteriaBuilder
import org.grails.core.util.StopWatch
import org.hibernate.Criteria
import org.hibernate.HibernateException
import org.hibernate.SessionFactory
import org.hibernate.Transaction
import org.hibernate.criterion.Criterion
import org.hibernate.criterion.Order
import org.hibernate.criterion.Projections
import org.hibernate.criterion.Restrictions
import org.hibernate.sql.JoinType
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired

@Transactional(readOnly = true)
class ProjectService {

    @Autowired
    Environment dataShowcaseEnvironment

    @Autowired
    SearchCriteriaBuilder searchCriteriaBuilder

    SessionFactory sessionFactory

    @Autowired
    ModelMapper modelMapper

    @CompileStatic
    static ProjectRepresentation map(Map projectData) {
        new ProjectRepresentation(
                name: projectData.name as String,
                lineOfResearch: projectData.lineOfResearch as String
        )
    }

    List<ProjectRepresentation> getProjects() {
        Project.findAll([sort: 'name', order: 'asc']).collect({
            modelMapper.map(it, ProjectRepresentation)
        })
    }

    List<ProjectRepresentation> getProjects(Set concepts, SearchQueryRepresentation searchQuery) {

        Criterion searchQueryCriterion = searchQuery ? searchCriteriaBuilder.buildCriteria(searchQuery) : null
        def stopWatch = new StopWatch('Fetch projects filtered items')
        stopWatch.start('Retrieve from database')

        Criteria criteria = sessionFactory.currentSession.createCriteria(Project, "p")
                .createAlias("p.items", "i")
                .createAlias("i.concept", "c")
                .createAlias("c.keywords", "k", JoinType.LEFT_OUTER_JOIN)
                .setProjection(Projections.projectionList()
                .add(Projections.distinct(Projections.property("p.name").as("name")))
                .add(Projections.property("p.lineOfResearch").as("lineOfResearch")))
        if (concepts) {
            criteria.add(Restrictions.in('c.conceptCode', concepts))
        }
        if (!dataShowcaseEnvironment.internalInstance) {
            criteria.add(Restrictions.eq('i.publicItem', true))
        }
        if (searchQueryCriterion) {
            criteria.add(searchQueryCriterion)
        }
        criteria.addOrder(Order.asc('p.name'))
        criteria.setResultTransformer(Criteria.ALIAS_TO_ENTITY_MAP)
        def projects = criteria.list() as List<Map>
        stopWatch.stop()

        stopWatch.start('Map to representations')
        def result = projects.collect { Map projectData ->
            map(projectData)
        }
        stopWatch.stop()
        log.info "Projects fetched.\n${stopWatch.prettyPrint()}"
        result
    }

}
