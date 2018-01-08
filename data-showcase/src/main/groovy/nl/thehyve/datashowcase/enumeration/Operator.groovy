package nl.thehyve.datashowcase.enumeration

import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

/**
 * Operator types supported by the criteria builder.
 */
@CompileStatic
@Slf4j
enum Operator {

    AND('and'),
    OR('or'),
    CONTAINS('contains'),
    EQUALS('='),
    NOT_EQUALS("!="),
    LIKE('like'),
    IN('in'),
    NOT('not'),
    NONE('none')

    String symbol

    Operator(String symbol) {
        this.symbol = symbol
    }

    private static final Map<String, Operator> mapping = new HashMap<>()

    static {
        for (Operator op : Operator.values()) {
            mapping.put(op.symbol, op)
        }
    }

    static Operator forSymbol(String symbol) {
        if (symbol == null) {
            return null
        }
        symbol = symbol.toLowerCase()
        if (mapping.containsKey(symbol)) {
            return mapping[symbol]
        } else {
            log.debug "Unknown operator: ${symbol}"
            return NONE
        }
    }
}
