package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import nl.thehyve.datashowcase.representation.ItemRepresentation
import org.springframework.beans.factory.annotation.Value

@Transactional
class DataService {

    @Value('${dataShowcase.environment}')
    String environment

    def clearDatabase() {
        Project.executeUpdate('delete from Project')
        LineOfResearch.executeUpdate('delete from LineOfResearch')
        nl.thehyve.datashowcase.Value.executeUpdate('delete from Value')
        Item.executeUpdate('delete from Item')
        Summary.executeUpdate('delete from Summary')
        TreeNode.executeUpdate('delete from TreeNode')
        Keyword.executeUpdate('delete from Keyword')
    }

    /**
     * Upload tree nodes and items.
     *
     * @param nodes The nodes to save.
     */
    def uploadData(List<TreeNode> domainStructure, List<ItemRepresentation> items) {
        if (environment == Constants.ENVIRONMENT_PUBLIC) {
            // TODO
        }
        // FIXME
        // - check if no public data is being uploaded.
        // - truncate tables
        // - upload items and associated data
        // - upload tree nodes
    }
}
