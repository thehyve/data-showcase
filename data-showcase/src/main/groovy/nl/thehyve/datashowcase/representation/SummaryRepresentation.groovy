package nl.thehyve.datashowcase.representation

import groovy.transform.CompileStatic

@CompileStatic
abstract class SummaryRepresentation {

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

    abstract List getValues()

}
