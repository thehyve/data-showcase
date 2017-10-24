/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

/**
 * The entity representing keywords used to annotate items (variables).
 */
class Keyword {

    String keyword

    @Override
    String toString() {
        keyword
    }

    static mapping = {
        version false
    }

    static constraints = {
        keyword unique: true
    }

}
