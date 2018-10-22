/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

/**
 * The class of summary entities, containing aggregate values
 * for a certain item (variable).
 */
class Summary {

    /**
     * The number of observations associated with the variable.
     */
    Long observationCount

    /**
     * The number of patients (subjects) for whom there are observations associated with the variable.
     */
    Long patientCount

    /**
     * The number of patients (subjects) for whom there are missing observations associated with the variable.
     */
    Long patientsWithMissingCount

    /**
     * A description of the stability (status) of the data.
     */
    String dataStability

    /**
     * The minimal value for the variable in the dataset.
     */
    Double minValue

    /**
     * The maximum value for the variable in the dataset.
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

    static belongsTo = [
            /**
             * The item this summary belongs to.
             */
            item: Item
    ]

    static hasMany = [
            /**
             * The values that occur for this variable.
             */
            values: Value
    ]

    static mapping = {
        version false
        values batchSize: 1000
    }

    static constraints = {
        observationCount            nullable: false
        patientCount                nullable: false
        patientsWithMissingCount    nullable: true
        dataStability               nullable: true
        minValue                    nullable: true
        maxValue                    nullable: true
        q1Value                     nullable: true
        medianValue                 nullable: true
        q3Value                     nullable: true
        avgValue                    nullable: true
        stdDevValue                 nullable: true
    }

}
