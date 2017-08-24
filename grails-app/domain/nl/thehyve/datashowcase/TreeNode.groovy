package nl.thehyve.datashowcase

class TreeNode {

    /**
     * The name of the node at the current level.
     */
    String name

    /**
     * The complete path of the node, including the name.
     */
    String path

    @Override
    String toString() {
        path
    }

    static belongsTo = [parent: TreeNode]

    /**
     * The child nodes directly below the current node.
     */
    static hasMany = [children: TreeNode]

    static constraints = {
        path unique: true
        parent nullable: true
    }
}
