package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import nl.thehyve.datashowcase.TreeNode

@Transactional(readOnly = true)
class TreeService {

    /**
     * Fetches all top nodes of the tree.
     * @return the list of top nodes with child nodes embedded.
     */
    List<TreeNode> getNodes() {
        TreeNode.findAll()
    }
}
