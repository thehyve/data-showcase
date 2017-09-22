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
     * The number of patients for whom there are observations associated with the variable.
     */
    Long patientCount

    /**
     * A description of the stability of the data.
     */
    String dataStability

    /**
     * The minimal value for the variable in the dataset.
     */
    Double minValue

    /**
     * The maximul value for the variable in the dataset.
     */
    Double maxValue

    /**
     * The average of the values for the variable in the dataset.
     */
    Double avgValue

    /**
     * The sample standard deviation of the values for the variable in the dataset.
     * (stddev_samp)
     */
    Double stdDevValue

    static belongsTo = [item: Item]

    static hasMany = [
            /**
             * The values that occur for this variable.
             */
            values: Value
    ]

    static constraints = {
        observationCount    nullable: false
        patientCount        nullable: false
        dataStability       nullable: false
        minValue            nullable: true
        maxValue            nullable: true
        avgValue            nullable: true
        stdDevValue         nullable: true
    }

}
