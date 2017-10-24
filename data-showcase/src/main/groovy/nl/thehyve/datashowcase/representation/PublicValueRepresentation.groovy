/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase.representation

import groovy.transform.CompileStatic

@CompileStatic
class PublicValueRepresentation {

    /**
     * The value (as String).
     */
    String value

    /**
     * A description of the value.
     */
    String label

}
