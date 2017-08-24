package nl.thehyve.datashowcase

import org.springframework.beans.factory.annotation.Autowired

class ItemController {

	static responseFormats = ['json']

    @Autowired
    ItemService itemService

    /**
     * Fetches all items.
     *
     * @return the list of items as JSON.
     */
    def index() {
        respond items: itemService.items
    }

    /**
     * Fetches the item with the id if it exists.
     *
     * @param id the id of the item.
     * @return the item as JSON.
     * @throws nl.thehyve.datashowcase.exception.ResourceNotFoundException
     * if the item does not exists.
     */
    def show(long id) {
        respond itemService.getItem(id)
    }

}
