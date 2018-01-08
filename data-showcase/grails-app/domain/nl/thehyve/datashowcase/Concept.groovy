/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

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

    static hasMany = [
        /**
         * Associated key words.
         */
        keywords: Keyword
    ]

    @Override
    String toString() {
        conceptCode
    }

    static mapping = {
        version false

        keywords batchSize: 1000
    }

    static constraints = {
        conceptCode unique: true
        labelNl nullable: true
        labelNlLong nullable: true
    }

}
