package nl.thehyve.datashowcase.representation

import groovy.transform.CompileStatic
import nl.thehyve.datashowcase.enumeration.VariableType

@CompileStatic
class ConceptRepresentation {

    /**
     * The short name of the variable.
     */
    String label

    /**
     * A textual description of the variable.
     */
    String labelLong

    /**
     * The short name of the variable.
     */
    String labelNl

    /**
     * A textual description of the variable.
     */
    String labelNlLong


    /**
     * The type of the variable in Transmart (textual, numerical, categorical).
     */
    VariableType variableType

}
