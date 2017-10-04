package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import groovy.transform.CompileStatic
import nl.thehyve.datashowcase.representation.TreeNodeRepresentation
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired

@Transactional(readOnly = true)
class TreeService {

    @Autowired
    ModelMapper modelMapper

    @Autowired
    ItemService itemService

    /**
     * Recursively enrich the tree with item counts.
     * Sets item counts on each nodes and accumulative counts
     * of the node and its children.
     * @param node the node (tree) to enrich.
     */
    @CompileStatic
    private void enrichWithItemCounts(TreeNodeRepresentation node) {
        long itemCount = itemService.countItemsForNode(node)
        node.itemCount = itemCount
        node.accumulativeItemCount = itemCount + (long)(node.children?.sum {
            TreeNodeRepresentation child ->
                enrichWithItemCounts(child)
                child.accumulativeItemCount
        } ?: 0)
    }

    /**
     * Fetches all top nodes of the tree.
     * @return the list of top nodes with child nodes embedded.
     */
    List<TreeNodeRepresentation> getNodes() {
        TreeNode.findAllByParentIsNull().collect { domain ->
            def node = modelMapper.map(domain, TreeNodeRepresentation.class)
            enrichWithItemCounts(node)
            node
        }
    }

}
