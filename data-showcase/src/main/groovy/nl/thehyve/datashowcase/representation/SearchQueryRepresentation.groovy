package nl.thehyve.datashowcase.representation

import groovy.transform.CompileStatic

@CompileStatic
class SearchQueryRepresentation {
    String type
    String value
    List<SearchQueryRepresentation> values
}
