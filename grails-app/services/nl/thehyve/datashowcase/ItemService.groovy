package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import nl.thehyve.datashowcase.exception.ConfigurationException
import nl.thehyve.datashowcase.exception.ResourceNotFoundException
import nl.thehyve.datashowcase.representation.InternalItemRepresentation
import nl.thehyve.datashowcase.representation.ItemRepresentation
import nl.thehyve.datashowcase.representation.PublicItemRepresentation
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value

@Transactional
class ItemService {

    @Autowired
    ModelMapper modelMapper

    @Value('${dataShowcase.environment}')
    String environment

    final boolean isInternalInstance() {
        if (![Constants.ENVIRONMENT_INTERNAL, Constants.ENVIRONMENT_PUBLIC].contains(environment)) {
            throw new ConfigurationException('Environment not configured.')
        }
        environment == Constants.ENVIRONMENT_INTERNAL
    }

    private ItemRepresentation convertToRepresentation(Item item) {
        if (internalInstance) {
            modelMapper.map(item, InternalItemRepresentation.class)
        } else {
            modelMapper.map(item, PublicItemRepresentation.class)
        }
    }

    @Transactional(readOnly = true)
    List<ItemRepresentation> getItems() {
        if (internalInstance) {
            Item.findAll().collect({
                convertToRepresentation(it)
            })
        } else {
            Item.findAllByPublicItem(true).collect({
                convertToRepresentation(it)
            })
        }
    }

    @Transactional(readOnly = true)
    ItemRepresentation getItem(long id) {
        def item
        if (internalInstance) {
            item = Item.findById(id)
        } else {
            item = Item.findByPublicItemAndId(true, id)
        }
        if (item == null) {
            throw new ResourceNotFoundException('Item not found')
        }
        convertToRepresentation(item)
    }

    def saveItems(List<ItemRepresentation> items) {

    }

}
