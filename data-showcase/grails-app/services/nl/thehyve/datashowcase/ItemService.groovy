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
import org.grails.core.util.StopWatch
import org.hibernate.Criteria
import org.hibernate.Session
import org.hibernate.SessionFactory
import org.hibernate.criterion.Projections
import org.hibernate.criterion.Restrictions
import org.hibernate.transform.Transformers
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired

@Transactional
class ItemService {

    @Autowired
    Environment dataShowcaseEnvironment

    @Autowired
    ModelMapper modelMapper

    SessionFactory sessionFactory

    @CompileStatic
    static ItemRepresentation map(Map itemData) {
        new ItemRepresentation(
                id: itemData.id as Long,
                name: itemData.name as String,
                labelLong: itemData.labelLong as String,
                project: itemData.projectName as String,
                concept: itemData.conceptCode as String,
                itemPath: itemData.itemPath as String,
                type: itemData.type as VariableType,
                publicItem: itemData.publicItem as boolean
        )
    }

    @Cacheable('items')
    @Transactional(readOnly = true)
    List<ItemRepresentation> getItems() {
        def stopWatch = new StopWatch('Fetch all items')
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
                    c.labelLong as labelLong,
                    c.variableType as type,
                    p.name as projectName,
                from Item as i
                join i.concept c
                join i.project p
                ${dataShowcaseEnvironment.internalInstance ?
                        '' : 'where i.publicItem = true'
                }
            """
        ).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP)
        .list() as List<Map>
        stopWatch.stop()
        stopWatch.start('Map to representations')
        def result = items.collect { Map itemData ->
            map(itemData)
        }
        stopWatch.stop()
        log.info "Items fetched.\n${stopWatch.prettyPrint()}"
        result
    }

    @Transactional(readOnly = true)
    List<ItemRepresentation> getItems(Set concepts, Set projects, def searchQuery) {

        String sqlSearchQueryChunk = toSQL(searchQuery)
        def stopWatch = new StopWatch('Fetch filtered items')
        stopWatch.start('Retrieve from database')
        def session = sessionFactory.openStatelessSession()

        Criteria criteria = session.createCriteria(Item, "i")
            .createAlias("i.concept", "c")
            .createAlias("i.project", "p")
            .setProjection(Projections.projectionList()
                .add(Projections.property("i.id").as("id"))
                .add(Projections.property("i.name").as("name"))
                .add(Projections.property("i.publicItem").as("publicItem"))
                .add(Projections.property("i.itemPath").as("itemPath"))
                .add(Projections.property("c.conceptCode").as("conceptCode"))
                .add(Projections.property("c.labelLong").as("labelLong"))
                .add(Projections.property("c.variableType").as("variableType"))
                .add(Projections.property("p.name").as("projectName")))
        if(concepts) {
            criteria.add( Restrictions.in('c.conceptCode', concepts))
        }
        if(projects) {
            criteria.add( Restrictions.in('p.name', projects))
        }
        if(dataShowcaseEnvironment.internalInstance) {
            criteria.add( Restrictions.eq('i.publicItem',true))
        }
        criteria.setResultTransformer(Criteria.ALIAS_TO_ENTITY_MAP)

        def items = criteria.list() as List<Map>
        stopWatch.stop()

        stopWatch.start('Map to representations')
        def result = items.collect { Map itemData ->
            map(itemData)
        }
        stopWatch.stop()
        log.info "Filtered items fetched.\n${stopWatch.prettyPrint()}"
        result

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

    private String toSQL(def query) {
        return "1=1"
    }

}
