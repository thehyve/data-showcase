/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

/**
 * Entity class to store lines of research.
 */
class LineOfResearch {

    /**
     * The name of the research line (unique).
     */
    String name

    @Override
    String toString() {
        name
    }

    static mapping = {
        version false
    }

    static constraints = {
        name unique: true
    }
}
