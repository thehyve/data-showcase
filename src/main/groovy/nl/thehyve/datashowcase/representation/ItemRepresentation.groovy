package nl.thehyve.datashowcase.representation

import groovy.transform.CompileStatic
import nl.thehyve.datashowcase.enumeration.ItemType

@CompileStatic
abstract class ItemRepresentation {

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
    ItemType type

    /**
     * A JSON value encoding the constraint that is used in Transmart to select
     * the data associated with the variable.
     */
    String constraint

    /**
     * Marks if the item is public or not. If it is public, the item may appear in public
     * instances of the data showcase and the associated summary data is more extensive.
     */
    boolean publicItem

    /**
     * Summary data for the variable: aggregate values and value frequencies.
     */
    abstract SummaryRepresentation getSummary()

    /**
     * The path of the associated domain.
     */
    String domain

    /**
     * The project (survey) the item belongs to.
     */
    String project

    /**
     * Associated key words.
     */
    List<String> keywords

}
