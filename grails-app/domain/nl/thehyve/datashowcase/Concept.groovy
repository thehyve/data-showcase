package nl.thehyve.datashowcase

import nl.thehyve.datashowcase.enumeration.VariableType

/**
 * A concept represents a variable, that is shared across projects.
 * It has labels, a type and the conceptCode that is used in Transmart.
 */
class Concept {

    /**
     * The unique code of the concept in Transmart.
     */
    String conceptCode

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

    @Override
    String toString() {
        conceptCode
    }

    static constraints = {
        conceptCode unique: true
    }

}
