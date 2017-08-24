package nl.thehyve.datashowcase

import nl.thehyve.datashowcase.enumeration.ItemType

/**
 * An item represents a variable in a study or survey.
 * Besides a descriptive label and links to associated data in Transmart
 * (type, constraint, concept path),
 * there can be associated values, aggregated (summary) data and
 * associated keywords.
 */
class Item {

    /**
     * A unique code for the variable.
     */
    String name

    /**
     * The short name of the variable.
     */
    String label

    /**
     * A textual description of the variable.
     */
    String labelLong

    /**
     * The type of the variable in Transmart (textual, numerical, categorical).
     */
    ItemType itemType

    /**
     * A JSON value encoding the constraint that is used in Transmart to select
     * the data associated with the variable.
     */
    String constraintJson

    /**
     * Marks if the item is public or not. If it is public, the item may appear in public
     * instances of the data showcase and the associated summary data is more extensive.
     */
    boolean publicItem

    /**
     * The subject domain to which the item belongs. The domains are organised
     * in a tree structure.
     */
    TreeNode domain

    /**
     * Associated key words.
     */
    List<Keyword> keywords

    /**
     * The project (survey) the item belongs to.
     */
    static belongsTo = [project: Project]

    /**
     * Summary data for the variable: aggregate values and value frequencies.
     */
    Summary summary

    static constraints = {
        name unique: true
        labelLong nullable: true
        domain nullable: true
    }

}
