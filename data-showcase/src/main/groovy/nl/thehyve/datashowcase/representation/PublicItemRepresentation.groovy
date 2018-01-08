/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase.representation

import groovy.transform.CompileStatic

@CompileStatic
class PublicItemRepresentation extends ItemRepresentation {

    /**
     * Summary data for the variable: aggregate values and value frequencies.
     */
    PublicSummaryRepresentation summary

}
