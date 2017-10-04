/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase.representation

import groovy.transform.CompileStatic
import nl.thehyve.datashowcase.enumeration.NodeType

@CompileStatic
class TreeNodeRepresentation {

    /**
     * The type of the node: either a domain or a concept (leaf).
     */
    NodeType nodeType

    /**
     * The label of the node at the current level.
     */
    String label

    /**
     * The concept code of the concept the node refers to, if it is of type Concept.
     */
    ConceptRepresentation concept

    /**
     * The complete path of the node, including the name.
     */
    String path

    /**
     * The number of items associated with the node.
     */
    Long itemCount

    /**
     * The accumulative item count for this node:
     * the number of items associated with the node combined
     * with the sum of the accumulative item counts of its children.
     */
    Long accumulativeItemCount

    /**
     * The child nodes directly below the current node.
     */
    List<TreeNodeRepresentation> children

}
