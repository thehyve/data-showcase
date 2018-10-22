/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase.representation

import groovy.transform.CompileStatic

@CompileStatic
class InternalSummaryRepresentation extends SummaryRepresentation {

    /**
     * The minimal value for the variable in the dataset.
     */
    Double minValue

    /**
     * The maximul value for the variable in the dataset.
     */
    Double maxValue

    /**
     * The first quartile value for the variable in the dataset.
     */
    Double q1Value

    /**
     * The median value for the variable in the dataset.
     */
    Double medianValue

    /**
     * The third quartile for the variable in the dataset.
     */
    Double q3Value

    /**
     * The average of the values for the variable in the dataset.
     */
    Double avgValue

    /**
     * The sample standard deviation of the values for the variable in the dataset.
     * (stddev_samp)
     */
    Double stdDevValue

    /**
     * The values that occur for this variable and the frequency of occurrence.
     */
    List<InternalValueRepresentation> values

}
