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
import nl.thehyve.datashowcase.representation.ConceptRepresentation
import nl.thehyve.datashowcase.representation.TreeNodeRepresentation
import org.grails.core.util.StopWatch
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
    private static void enrichWithItemCounts(TreeNodeRepresentation node, final Map<String, Long> itemCountMap) {
        if (node == null) {
            return
        }
        long itemCount = itemCountMap[node.path] ?: 0
        node.itemCount = itemCount
        node.accumulativeItemCount = itemCount + (long)(node.children?.sum {
            TreeNodeRepresentation child ->
                enrichWithItemCounts(child, itemCountMap)
                child.accumulativeItemCount
        } ?: 0)
    }

    @CompileStatic
    static TreeNodeRepresentation map(TreeNode node) {
        def result = new TreeNodeRepresentation(
                nodeType: node.nodeType,
                label: node.label,
                path: node.path,
                concept: node.concept?.conceptCode,
                variableType: node.concept?.variableType
        )
        if (node.children) {
            result.children = node.children.collect {
                map(it)
            }
        }
        result
    }

    /**
     * Fetches all top nodes of the tree.
     * @return the list of top nodes with child nodes embedded.
     */
    @Cacheable('tree_nodes')
    List<TreeNodeRepresentation> getNodes() {
        def stopWatch = new StopWatch('Fetch tree nodes')
        stopWatch.start('Retrieve from database')
        def nodes = TreeNode.findAllByParentIsNull()
        stopWatch.stop()
        stopWatch.start('Map to representations')
        def result = nodes.collect { domain ->
            map(domain)
        }
        stopWatch.stop()
        stopWatch.start('Enrich with counts')
        def itemCountMap = itemService.itemCountPerNode
        result.each { node ->
            enrichWithItemCounts(node, itemCountMap)
        }
        stopWatch.stop()
        log.info "Fetched tree nodes.\n${stopWatch.prettyPrint()}"
        result
    }

    @CacheEvict(value = 'tree_nodes', allEntries = true)
    void clearTreeNodesCache() {
        log.info "Clear tree nodes cache."
    }

}
