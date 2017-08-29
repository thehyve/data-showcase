package nl.thehyve.datashowcase.representation

import groovy.transform.CompileStatic

@CompileStatic
class TreeNodeRepresentation {

    /**
     * A descriptive label of the node.
     */
    String label

    /**
     * The name of the node at the current level.
     */
    String name

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
