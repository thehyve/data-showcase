package nl.thehyve.datashowcase

class TreeNode {

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

    static belongsTo = [parent: TreeNode]

    /**
     * The child nodes directly below the current node.
     */
    static hasMany = [children: TreeNode]

    /**
     * Tree node constructor. Constructs the path of the node
     * from the parent path and the name.
     *
     * @param parent the parent of the tree node (can be null).
     * @param name the name of the node at the current level.
     * @param label a description of the node (default to the name).
     */
    TreeNode(TreeNode parent, String name, String label = name) {
        this.parent = parent
        this.name = name
        this.label = label
        this.path = "${(parent?.path ?: '')}/${name}"
        if (parent) {
            parent.addToChildren(this)
        }
    }

    @Override
    String toString() {
        path
    }

    static constraints = {
        path unique: true
        parent nullable: true
    }

}
