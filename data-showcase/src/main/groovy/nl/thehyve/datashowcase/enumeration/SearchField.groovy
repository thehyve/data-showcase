package nl.thehyve.datashowcase.enumeration

import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

/**
 * The fields on which it is possible to search (a free text filter).
 */
@CompileStatic
@Slf4j
enum SearchField {
    /**
     * Name of the item.
     */
    NAME('name'),
    /**
     * Key words associated with concept.
     */
    KEYWORDS('keywords'),
    /**
     * The short name of the variable in English associated with concept.
     */
    LABEL('label'),
    /**
     * A textual description of the variable in English associated with concept.
     */
    LABEL_LONG('labelLong'),
    /**
     * The short name of the variable in Dutch associated with concept.
     */
    LABEL_NL('labelNl'),
    /**
     * A textual description of the variable in Dutch associated with concept.
     */
    LABEL_NL_LONG('labelNlLong'),
    /**
     * Unknown field.
     */
    NONE('none')

    String value

    SearchField(String value) {
        this.value = value
    }

    private static final Map<String, SearchField> mapping = new HashMap<>()

    static {
        for (SearchField type : values()) {
            mapping.put(type.value, type)
        }
    }

    static SearchField forName(String name) {
        if (mapping.containsKey(name)) {
            return mapping[name]
        } else {
            log.debug "Unknown search field: ${name}"
            return NONE
        }
    }

}
