package nl.thehyve.datashowcase

/**
 * The entity representing a value for an item (a variable).
 */
class Value {

    /**
     * The value (as String).
     */
    String value

    /**
     * A description of the value.
     */
    String label

    /**
     * The number of observations for each of the values for the variable in the dataset.
     */
    Long frequency

    /**
     * The summary of the item the value belongs to.
     */
    static belongsTo = [summary: Summary]

    static mapping = {
        version false
    }

    static constraints = {
        frequency nullable: true
    }

}
