package nl.thehyve.datashowcase

import nl.thehyve.datashowcase.enumeration.NodeType
import nl.thehyve.datashowcase.exception.InvalidDataException

class TreeNode {

    /**
     * The type of the node: either a domain or a concept (leaf).
     */
    NodeType nodeType

    /**
     * The label of the node at the current level.
     */
    String label

    /**
     * The complete path of the node, including the label.
     */
    String path

    static belongsTo = [parent: TreeNode]

    /**
     * The child nodes directly below the current node.
     */
    static hasMany = [children: TreeNode]

    /**
     * The concept the node is associated with, if it is a concept node.
     * A concept node always is a leaf node.
     */
    Concept concept

    /**
     * Tree node constructor. Constructs the path of the node
     * from the parent path and the label.
     *
     * @param parent the parent of the tree node (can be null).
     * @param label a description of the node at the current level.
     */
    TreeNode(TreeNode parent, String label) {
        this.parent = parent
        this.label = label
        this.path = "${(parent?.path ?: '')}/${this.label}"
        this.nodeType = NodeType.Domain
        if (parent) {
            if (parent.nodeType == NodeType.Concept) {
                throw new InvalidDataException("Tree nodes cannot be added to a concept node.")
            }
            parent.addToChildren(this)
        }
    }

    /**
     * Tree node constructor for concept nodes. Constructs the path of the node
     * from the parent path and the concept.
     *
     * @param parent the parent of the tree node (can be null).
     * @param concept the concept this node represents.
     */
    TreeNode(TreeNode parent, Concept concept) {
        this(parent, concept.label)
        this.nodeType = NodeType.Concept
        this.concept = concept
    }

    @Override
    String toString() {
        path
    }

    static mapping = {
        version false
    }

    static constraints = {
        path unique: true
        parent nullable: true
        concept nullable: true
    }

}
