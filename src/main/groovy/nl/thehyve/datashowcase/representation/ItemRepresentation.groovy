package nl.thehyve.datashowcase.representation

import groovy.transform.CompileStatic
import nl.thehyve.datashowcase.enumeration.VariableType

@CompileStatic
abstract class ItemRepresentation {

    /**
     * An id of the variable
     */
    Long id

    /**
     * A unique code for the variable.
     */
    String name

    /**
     * The short name of the variable in English.
     */
    String label

    /**
     * A textual description of the variable in English.
     */
    String labelLong

    /**
     * The short name of the variable in Dutch.
     */
    String labelNl

    /**
     * A textual description of the variable in Dutch.
     */
    String labelNlLong

    /**
     * The full path of the item that can be used in tranSMART
     */
    String itemPath

    /**
     * The type of the variable in tranSMART (textual, numerical, categorical).
     */
    VariableType type

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
     * The concept code of the associated concept.
     */
    String concept

    /**
     * The project (survey) the item belongs to.
     */
    String project

    /**
     * Associated key words.
     */
    List<String> keywords

}
