/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import org.springframework.beans.factory.annotation.Autowired

@Transactional
class DataService {

    @Autowired
    Environment dataShowcaseEnvironment

    @Autowired
    ItemService itemService

    @Autowired
    ConceptService conceptService

    @Autowired
    TreeService treeService

    def clearCaches() {
        itemService.clearItemsCache()
        itemService.clearItemCountsCache()
        conceptService.clearConceptsCache()
        treeService.clearTreeNodesCache()
    }

    def clearDatabase() {
        Value.executeUpdate('delete from Value')
        Summary.executeUpdate('delete from Summary')
        Item.executeUpdate('delete from Item')
        TreeNode.executeUpdate('delete from TreeNode')
        Concept.executeUpdate('delete from Concept')
        Keyword.executeUpdate('delete from Keyword')
        Project.executeUpdate('delete from Project')
        LineOfResearch.executeUpdate('delete from LineOfResearch')
    }

}
