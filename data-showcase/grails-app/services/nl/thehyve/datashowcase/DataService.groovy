/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import nl.thehyve.datashowcase.representation.ItemRepresentation
import org.springframework.beans.factory.annotation.Autowired

@Transactional
class DataService {

    @Autowired
    Environment dataShowcaseEnvironment

    def clearDatabase() {
        Value.executeUpdate('delete from Value')
        Item.executeUpdate('delete from Item')
        Summary.executeUpdate('delete from Summary')
        TreeNode.executeUpdate('delete from TreeNode')
        Concept.executeUpdate('delete from Concept')
        Keyword.executeUpdate('delete from Keyword')
        Project.executeUpdate('delete from Project')
        LineOfResearch.executeUpdate('delete from LineOfResearch')
    }

    /**
     * Upload concepts, tree nodes and items.
     *
     * @param concepts The concepts to save.
     * @param nodes The nodes to save.
     * @param items The items to save.
     */
    def uploadData(List<Concept> concepts, List<TreeNode> nodes, List<ItemRepresentation> items) {
        if (!dataShowcaseEnvironment.internalInstance) {
            // TODO
        }
        // FIXME
        // - check if no public data is being uploaded.
        // - truncate tables
        // - upload concepts
        // - upload items and associated data
        // - upload tree nodes
    }
}
