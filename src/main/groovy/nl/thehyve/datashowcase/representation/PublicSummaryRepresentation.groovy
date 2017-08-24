package nl.thehyve.datashowcase.representation

import groovy.transform.CompileStatic

@CompileStatic
class PublicSummaryRepresentation extends SummaryRepresentation {

    /**
     * The values that occur for this variable.
     */
    List<PublicValueRepresentation> values

}
