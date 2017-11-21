/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import grails.plugin.cache.CacheEvict
import grails.plugin.cache.Cacheable
import groovy.transform.CompileStatic
import nl.thehyve.datashowcase.enumeration.VariableType
import nl.thehyve.datashowcase.exception.ResourceNotFoundException
import nl.thehyve.datashowcase.representation.InternalItemRepresentation
import nl.thehyve.datashowcase.representation.ItemRepresentation
import nl.thehyve.datashowcase.representation.PublicItemRepresentation
import nl.thehyve.datashowcase.representation.SearchQueryRepresentation
import nl.thehyve.datashowcase.search.SearchCriteriaBuilder
import org.grails.core.util.StopWatch
import org.hibernate.Criteria
import org.hibernate.Session
import org.hibernate.SessionFactory
import org.hibernate.criterion.Criterion
import org.hibernate.criterion.Order
import org.hibernate.criterion.Projections
import org.hibernate.criterion.Restrictions
import org.hibernate.sql.JoinType
import org.hibernate.transform.Transformers
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired

@Transactional
class ItemService {

    @Autowired
    Environment dataShowcaseEnvironment

    @Autowired
    ModelMapper modelMapper

    @Autowired
    SearchCriteriaBuilder searchCriteriaBuilder

    SessionFactory sessionFactory

    @CompileStatic
    static ItemRepresentation map(Map itemData) {
        new ItemRepresentation(
                id: itemData.id as Long,
                name: itemData.name as String,
                label: itemData.label as String,
                labelLong: itemData.labelLong as String,
                project: itemData.projectName as String,
                concept: itemData.conceptCode as String,
                itemPath: itemData.itemPath as String,
                type: itemData.type as VariableType,
                publicItem: itemData.publicItem as boolean
        )
    }

    static String propertyNameFromRepresentationName(String name) {
        switch (name){
            case "project": return "projectName"
            case "concept": return "conceptCode"
            case "label": return "label"
            case "lineofresearch": return "p.lineOfResearch"
            default: return "i.name"
        }
    }

    @Cacheable('items')
    @Transactional(readOnly = true)
    List<ItemRepresentation> getItems(int firstResult, int maxResults, String order, String propertyName) {
        def property = propertyNameFromRepresentationName(propertyName)

        def stopWatch = new StopWatch('Fetch items')
        stopWatch.start('Retrieve from database')
        def session = sessionFactory.openStatelessSession()
        def items = session.createQuery(
                """
                select
                    i.id as id,
                    i.name as name,
                    i.publicItem as publicItem,
                    i.itemPath as itemPath,
                    c.conceptCode as conceptCode,
                    c.label as label,
                    c.labelLong as labelLong,
                    c.variableType as type,
                    p.name as projectName
                from Item as i
                join i.concept c
                join i.project p
                ${dataShowcaseEnvironment.internalInstance ?
                        '' : 'where i.publicItem = true'
                }
                order by $property ${order == 'desc' ?
                        'desc' : 'asc' 
                }                
            """
        ).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP)
                .setFirstResult(firstResult)
                .setMaxResults(maxResults)
                .list() as List<Map>
        stopWatch.stop()
        stopWatch.start('Map to representations')
        def result = items.collect { Map itemData ->
            map(itemData)
        }
        stopWatch.stop()
        log.info "${result.size()} items fetched.\n${stopWatch.prettyPrint()}"
        result
    }

    @Transactional(readOnly = true)
    List<ItemRepresentation> getItems(int firstResult, int maxResults, String order, String propertyName,
                                      Set concepts, Set projects, SearchQueryRepresentation searchQuery) {

        def property = propertyNameFromRepresentationName(propertyName)
        Criterion searchQueryCriterion = searchQuery ? searchCriteriaBuilder.buildCriteria(searchQuery) : null
        def stopWatch = new StopWatch('Fetch filtered items')
        stopWatch.start('Retrieve from database')
        def session = sessionFactory.openStatelessSession()

        Criteria criteria = session.createCriteria(Item, "i")
            .createAlias("i.concept", "c")
            .createAlias("i.project", "p")
            .createAlias("c.keywords", "k", JoinType.LEFT_OUTER_JOIN)
            .setProjection(Projections.projectionList()
                .add(Projections.distinct(Projections.property("i.id").as("id")))
                .add(Projections.property("i.name").as("name"))
                .add(Projections.property("i.publicItem").as("publicItem"))
                .add(Projections.property("i.itemPath").as("itemPath"))
                .add(Projections.property("c.conceptCode").as("conceptCode"))
                .add(Projections.property("c.label").as("label"))
                .add(Projections.property("c.labelLong").as("labelLong"))
                .add(Projections.property("c.variableType").as("variableType"))
                .add(Projections.property("p.name").as("projectName")))
        if(concepts) {
            criteria.add( Restrictions.in('c.conceptCode', concepts))
        }
        if(projects) {
            criteria.add( Restrictions.in('p.name', projects))
        }
        if(!dataShowcaseEnvironment.internalInstance) {
            criteria.add( Restrictions.eq('i.publicItem',true))
        }
        if(searchQueryCriterion) {
            criteria.add(searchQueryCriterion)
        }
        criteria.setResultTransformer(Criteria.ALIAS_TO_ENTITY_MAP)
                .setFirstResult(firstResult)
                .setMaxResults(maxResults)
        if (order == "desc") {
            criteria.addOrder(Order.desc(property))
        } else {
            criteria.addOrder(Order.asc(property))
        }
        def items = criteria.list() as List<Map>

        stopWatch.stop()

        stopWatch.start('Map to representations')
        def result = items.collect { Map itemData ->
            map(itemData)
        }
        stopWatch.stop()
        log.info "${result.size()} filtered items fetched.\n${stopWatch.prettyPrint()}"
        result
    }

    @Transactional(readOnly = true)
    Long getItemsCount(Set concepts, Set projects, SearchQueryRepresentation searchQuery) {

        Criterion searchQueryCriterion = searchQuery ? searchCriteriaBuilder.buildCriteria(searchQuery) : null
        def stopWatch = new StopWatch('Items count')
        stopWatch.start('Retrieve from database')
        def session = sessionFactory.openStatelessSession()

        Criteria criteria = session.createCriteria(Item, "i")
                .createAlias("i.concept", "c")
                .createAlias("i.project", "p")
                .createAlias("c.keywords", "k", JoinType.LEFT_OUTER_JOIN)
        if(concepts) {
            criteria.add( Restrictions.in('c.conceptCode', concepts))
        }
        if(projects) {
            criteria.add( Restrictions.in('p.name', projects))
        }
        if(!dataShowcaseEnvironment.internalInstance) {
            criteria.add( Restrictions.eq('i.publicItem',true))
        }
        if(searchQueryCriterion) {
            criteria.add(searchQueryCriterion)
        }
        criteria.setResultTransformer(Criteria.ALIAS_TO_ENTITY_MAP)
                .setProjection(Projections.countDistinct('i.id'))
        Long totalItemsCount = (Long)criteria.uniqueResult()

        stopWatch.stop()
        log.info "Total item count: ${totalItemsCount}"
        totalItemsCount
    }

    @CacheEvict(value = 'items', allEntries = true)
    void clearItemsCache() {
        log.info "Clear items cache."
    }

    @Transactional(readOnly = true)
    @Cacheable('itemCountPerNode')
    Map<String, Long> getItemCountPerNode() {
        Session session = sessionFactory.currentSession
        if (dataShowcaseEnvironment.internalInstance) {
            def itemCountMap = session.createQuery(
                """ select n.path as path, count(distinct i) as itemCount
                    from Item i, TreeNode n
                    join i.concept c
                    where n.concept = c
                    group by n.path
                """
            ).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP)
            .list() as List<Map>
            itemCountMap.collectEntries {
                [(it.path): it.itemCount as Long]
            }
        } else {
            def itemCountMap = session.createQuery(
                """ select n.path as path, count(distinct i) as itemCount
                    from Item i, TreeNode n
                    join i.concept c
                    where n.concept = c
                    and i.publicItem = true
                    group by n.path
                """
            ).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP)
            .list() as List<Map>
            itemCountMap.collectEntries {
                [(it.path): it.itemCount as Long]
            }
        }
    }

    @CacheEvict(value = 'itemCountPerNode', allEntries = true)
    void clearItemCountsCache() {
        log.info "Clear items counts cache."
    }

    @Transactional(readOnly = true)
    ItemRepresentation getItem(long id) {
        if (dataShowcaseEnvironment.internalInstance) {
            def item = Item.findById(id)
            if (item) {
                return modelMapper.map(item, InternalItemRepresentation.class)
            }
        } else {
            def item = Item.findByPublicItemAndId(true, id)
            if (item) {
                return modelMapper.map(item, PublicItemRepresentation.class)
            }
        }
        throw new ResourceNotFoundException('Item not found')
    }
}
