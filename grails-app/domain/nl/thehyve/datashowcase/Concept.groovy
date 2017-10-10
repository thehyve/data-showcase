package nl.thehyve.datashowcase

import grails.databinding.BindUsing
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
     * The type of the variable in Transmart (textual, numerical, categorical).
     */
    VariableType variableType

    /**
     * Associated key words.
     */
    @BindUsing({ obj, source ->
        def keywords = source['keywords'].collect {
            Keyword existingKeyword = Keyword.findByKeyword(it)
            existingKeyword ?: new Keyword(keyword: it).save(flush: true)
        }
        keywords
    })
    List<Keyword> keywords

    @Override
    String toString() {
        conceptCode
    }

    static mapping = {
        version false
    }

    static constraints = {
        conceptCode unique: true
        labelNl nullable: true
        labelNlLong nullable: true
    }

}
