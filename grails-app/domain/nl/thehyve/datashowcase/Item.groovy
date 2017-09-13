package nl.thehyve.datashowcase
/**
 * An item represents a variable in a study or survey.
 * Besides links to the concept and project it belongs to,
 * there can be associated values, aggregated (summary) data and
 * associated keywords.
 */
class Item {

    /**
     * A unique code for the variable.
     */
    String name

    /**
     * The full path of the item that can be used in tranSMART
     */
    String itemPath

    /**
     * Marks if the item is public or not. If it is public, the item may appear in public
     * instances of the data showcase and the associated summary data is more extensive.
     */
    boolean publicItem

    /**
     * The concept that the item represents in a project.
     */
    Concept concept

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

    String getLabel() {
        concept.label
    }

    String getLabelLong() {
        concept.labelLong
    }

    String getType() {
        concept.variableType
    }

    static constraints = {
        name unique: true
    }

}
