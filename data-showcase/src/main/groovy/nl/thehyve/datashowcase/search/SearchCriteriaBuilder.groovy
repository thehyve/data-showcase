package nl.thehyve.datashowcase.search

import groovy.json.JsonOutput
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import nl.thehyve.datashowcase.enumeration.Operator
import nl.thehyve.datashowcase.enumeration.SearchField
import nl.thehyve.datashowcase.representation.SearchQueryRepresentation
import org.hibernate.criterion.Criterion
import org.hibernate.criterion.MatchMode
import org.hibernate.criterion.Restrictions

/**
 * The class for parsing search criteria from free text filter, serialized as JSON
 * into Hibernate Criteria
 */
@CompileStatic
@Slf4j
class SearchCriteriaBuilder {

    private final static String ITEM_ALIAS = "i"
    private final static String CONCEPT_ALIAS = "c"
    private final static String KEYWORDS_ALIAS = "k"

    private final Operator defaultOperator = Operator.CONTAINS

    private static final EnumSet<Operator> booleanOperators = EnumSet.of(Operator.NOT, Operator.AND, Operator.OR)
    private static final EnumSet<Operator> valueOperators = EnumSet.of(
            Operator.EQUALS,
            Operator.NOT_EQUALS,
            Operator.CONTAINS,
            Operator.LIKE,
            Operator.IN
    )

    /**
     * Returns true if operator equals AND or OR
     * @param operator
     * @return
     */
    private static boolean isBooleanOperator(Operator operator) {
        booleanOperators.contains(operator)
    }

    /**
     * Returns true if the operator is a value operator
     * @param operator
     * @return
     */
    private static boolean isValueOperator(Operator operator) {
        valueOperators.contains(operator)
    }

    private static Criterion applyOperator(Operator operator, String propertyName, String value) {
        switch (operator) {
            case Operator.CONTAINS:
                return Restrictions.ilike(propertyName, value as String, MatchMode.ANYWHERE)
            case Operator.EQUALS:
                return Restrictions.ilike(propertyName, value as String, MatchMode.EXACT)
            case Operator.NOT_EQUALS:
                return Restrictions.not(Restrictions.ilike(propertyName, value as String, MatchMode.EXACT))
            case Operator.LIKE:
                return Restrictions.ilike(propertyName, value as String)
            default:
                throw new IllegalArgumentException("Unsupported operator: ${operator}.")
        }
    }

    /**
     * Create single Restriction criterion for a specified operator
     * @param operator
     * @param propertyName
     * @param value
     * @return
     */
    private static Criterion buildSingleCriteria(Operator operator, SearchField field, List<String> values) {
        String propertyName = searchFieldToPropertyName(field)
        switch (operator) {
            case Operator.CONTAINS:
            case Operator.EQUALS:
            case Operator.LIKE:
                def criteria = values.collect { applyOperator(operator, propertyName, it) }
                if (criteria.size() == 1) {
                    return criteria[0]
                } else {
                    return Restrictions.or(criteria.toArray() as Criterion[])
                }
            case Operator.NOT_EQUALS:
                def criteria = values.collect { applyOperator(operator, propertyName, it) }
                def arg
                if (criteria.size() == 1) {
                    arg = criteria[0]
                } else {
                    arg = Restrictions.or(criteria.toArray() as Criterion[])
                }
                return Restrictions.not(arg)
            case Operator.IN:
                return Restrictions.in(propertyName, values)
            default:
                throw new IllegalArgumentException("Unsupported operator: ${operator}.")
        }
    }

    static Criterion expressionToCriteria(Operator operator, List<Criterion> criteria) {
        log.info "Applying ${operator} to ${criteria.size()} arguments."
        switch (operator) {
            case Operator.NOT:
                if (criteria.size() != 1) {
                    throw new IllegalArgumentException("Not can only be applied to a single argument.")
                }
                log.info "Applying NOT to ${criteria.size()} argument."
                return Restrictions.not(criteria[0])
            case Operator.AND:
                log.info "Applying AND to ${criteria.size()} arguments."
                return Restrictions.and(criteria.toArray() as Criterion[])
            case Operator.OR:
                log.info "Applying OR to ${criteria.size()} arguments."
                return Restrictions.or(criteria.toArray() as Criterion[])
            default:
                throw new IllegalArgumentException("Unsupported operator: ${operator}.")
        }
    }

    /**
     * If searchField is not specified, search query is applied to all supported properties
     * @param operator
     * @param value
     * @return
     */
    private static Criterion applyToAllSearchFields(Operator operator, List<String> values) {
        List<Criterion> criteria = []
        SearchField.values().each { SearchField field ->
            if (field != SearchField.NONE) {
                def singleCriteria = buildSingleCriteria(operator, field, values)
                criteria.add(singleCriteria)
            }
        }
        return expressionToCriteria(Operator.OR, criteria)
    }

    /**
     * Parse specified field to supported property name
     * @param field
     * @return
     */
    private static String searchFieldToPropertyName(SearchField field) {
        switch (field) {
            case SearchField.NAME:
                return ITEM_ALIAS + "." + SearchField.NAME.value
            case SearchField.KEYWORD:
            case SearchField.KEYWORDS:
                return KEYWORDS_ALIAS + "." + "keyword"
            case SearchField.LABEL:
                return CONCEPT_ALIAS + "." + SearchField.LABEL.value
            case SearchField.LABEL_LONG:
                return CONCEPT_ALIAS + "." + SearchField.LABEL_LONG.value
            case SearchField.LABEL_NL:
                return CONCEPT_ALIAS + "." + SearchField.LABEL_NL.value
            case SearchField.LABEL_NL_LONG:
                return CONCEPT_ALIAS + "." + SearchField.LABEL_NL_LONG.value
            default:
                return SearchField.NONE.value
        }
    }

    /**
     * Construct criteria from JSON query
     * @param query
     * @return
     */
    Criterion buildCriteria(SearchQueryRepresentation query) {
        log.info "Build criteria: ${query}"
        if (query == null) {
            return null
        }
        def type = query.type
        if (type == null) {
            log.error "Unexpected null type in object: ${JsonOutput.toJson(query)}"
            return null
        }
        else if (type == 'string') {
            def values = [query.value as String]
            log.info "Applying default operator ${defaultOperator} on args: ${values}"
            return applyToAllSearchFields(defaultOperator, values)
        } else {
            def operator = Operator.forSymbol(type)
            if (isBooleanOperator(operator)) {
                return expressionToCriteria(operator, query.values.collect { buildCriteria(it) })
            } else if (isValueOperator(operator)) {
                def propertyName = query.value
                def property = SearchField.NONE
                def args = query.values.collect { it.value }
                if (propertyName && propertyName != '*') {
                    property = SearchField.forName(propertyName)
                    if (property == SearchField.NONE) {
                        throw new IllegalArgumentException("Unsupported property: ${propertyName}.")
                    }
                }
                if (property != SearchField.NONE) {
                    log.info "Applying ${operator} on field ${property} with args: ${args}"
                    // applying an operator to a field with a list of values
                    return buildSingleCriteria(operator, property, args)
                } else {
                    log.info "Applying ${operator} on args: ${args}"
                    // applying an operator to all fields with a list of values
                    return applyToAllSearchFields(operator, args)
                }
            } else {
                throw new IllegalArgumentException("Unsupported type: ${type}.")
            }
        }
    }

}
