/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import grails.plugin.cache.CacheEvict
import grails.plugin.cache.Cacheable
import nl.thehyve.datashowcase.exception.ResourceNotFoundException
import nl.thehyve.datashowcase.mapping.ItemMapper
import nl.thehyve.datashowcase.representation.ItemRepresentation
import org.grails.core.util.StopWatch
import org.springframework.beans.factory.annotation.Autowired

@Transactional
class ItemService {

    @Autowired
    Environment dataShowcaseEnvironment

    @Autowired
    ItemMapper itemMapper

    @Transactional(readOnly = true)
    List<ItemRepresentation> getItems() {
        if (dataShowcaseEnvironment.internalInstance) {
            def stopWatch = new StopWatch('Fetch items')
            stopWatch.start('Retrieve from database')
            def items = Item.findAll()
            stopWatch.stop()
            stopWatch.start('Map to representations')
            def result = items.collect {
                itemMapper.map(it)
            }
            stopWatch.stop()
            log.info "Items fetched.\n${stopWatch.prettyPrint()}"
            result
        } else {
            Item.findAllByPublicItem(true).collect {
                itemMapper.map(it)
            }
        }
    }

    @Transactional(readOnly = true)
    @Cacheable('itemCountPerNode')
    Map<String, Long> getItemCountPerNode() {
        if (dataShowcaseEnvironment.internalInstance) {
            def itemCountMap = Item.executeQuery(
                """ select n.path as path, count(distinct i) as itemCount
                    from Item i, TreeNode n
                    join i.concept c
                    where n.concept = c
                    group by n.path
                """
            ) as List<List>
            itemCountMap.collectEntries {
                [(it[0]): it[1] as Long]
            }
        } else {
            def itemCountMap = Item.executeQuery(
                """ select n.path as path, count(distinct i) as itemCount
                    from Item i, TreeNode n
                    join i.concept c
                    where n.concept = c
                    and i.publicItem = true
                    group by n.path
                """
            ) as List<List>
            itemCountMap.collectEntries {
                [(it[0]): it[1] as Long]
            }
        }
    }

    @CacheEvict(value = 'itemCountPerNode', allEntries = true)
    void clearItemCountsCache() {
        log.info "Clear items counts cache."
    }

    @Transactional(readOnly = true)
    ItemRepresentation getItem(long id) {
        def item
        if (dataShowcaseEnvironment.internalInstance) {
            item = Item.findById(id)
        } else {
            item = Item.findByPublicItemAndId(true, id)
        }
        if (item == null) {
            throw new ResourceNotFoundException('Item not found')
        }
        itemMapper.map(item)
    }

}
