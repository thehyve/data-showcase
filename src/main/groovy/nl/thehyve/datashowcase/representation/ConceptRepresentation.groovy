package nl.thehyve.datashowcase.representation

import groovy.transform.CompileStatic
import nl.thehyve.datashowcase.enumeration.VariableType

@CompileStatic
abstract class ConceptRepresentation {

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
    VariableType variableType

    /**
     * The path of the associated tree node.
     */
    String node

}