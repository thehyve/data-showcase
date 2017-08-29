package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import grails.plugin.cache.Cacheable
import nl.thehyve.datashowcase.exception.ResourceNotFoundException
import nl.thehyve.datashowcase.mapping.ItemMapper
import nl.thehyve.datashowcase.representation.ItemRepresentation
import nl.thehyve.datashowcase.representation.TreeNodeRepresentation
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
            Item.findAll().collect({
                itemMapper.map(it)
            })
        } else {
            Item.findAllByPublicItem(true).collect({
                itemMapper.map(it)
            })
        }
    }

    @Transactional(readOnly = true)
    @Cacheable('itemcounts')
    Long countItemsForDomain(String path) {
        if (dataShowcaseEnvironment.internalInstance) {
            Item.executeQuery(
                """ select count(distinct i) from Item i
                    join i.domain d
                    where d.path = :path 
                """,
                [path: path]
            )[0]
        } else {
            Item.executeQuery(
                """ select count(distinct i) from Item i
                    join i.domain d
                    where d.path = :path
                    and i.publicItem = true 
                """,
                [path: path]
            )[0]
        }
    }

    @Transactional(readOnly = true)
    Long countItemsForDomain(TreeNodeRepresentation domain) {
        countItemsForDomain(domain.path)
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

    def saveItems(List<ItemRepresentation> items) {

    }

}
