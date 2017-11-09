package nl.thehyve.datashowcase.search

import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component

/**
 * Operator types supported by the criteria builder.
 */
@CompileStatic
@Component
@Slf4j
enum Operator {

    AND('and'),
    OR('or'),
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
        if (mapping.containsKey(symbol)) {
            return mapping[symbol]
        } else {
            log.error "Unknown operator: ${symbol}"
            return NONE
        }
    }
}
