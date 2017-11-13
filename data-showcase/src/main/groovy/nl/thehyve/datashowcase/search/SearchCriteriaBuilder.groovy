package nl.thehyve.datashowcase.search

import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import org.hibernate.criterion.Criterion
import org.hibernate.criterion.MatchMode
import org.hibernate.criterion.Restrictions
import sun.reflect.generics.reflectiveObjects.NotImplementedException

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

    /**
     * Construct criteria from JSON query
     * @param query
     * @return
     */
    Criterion buildCriteria(Map query) {
        if (query == null) {
            return null
        }
        def type = query.type as String
        if (type == 'string') {
            List values = []
            values.addAll(query.value)
            List<Criterion> criteria = buildCriteriaFromChunks(values)
            if (criteria.size() > 1) {
                throw new IllegalArgumentException("Specified search query is invalid.")
            }
            return criteria.first()
        } else {
            def operator = Operator.forSymbol(type)
            if (isJunctionOperator(operator)) {
                List values = []
                List<Criterion> criteria = []

                query.values.each { Map c ->
                    if (c.type == "string") {
                        if (c.value != ",") {
                            values.add(c.value)
                        }
                    } else {
                        criteria.add(buildCriteria(c))
                    }
                }
                criteria.addAll(buildCriteriaFromChunks(values))
                Criterion[] criteriaArray = criteria.collect { it }
                return expressionToCriteria(operator, criteriaArray)
            } else {
                throw new IllegalArgumentException("Unsupported search type: ${type}.")
            }
        }
    }

    /**
     * Build criteria for each { "type": "string", "value": "<value>"} element (chunk)
     * Where chunk can be a representation of search field, operator or values
     * @param values - list of "<value>" from all elements (chunks)
     * @return
     */
    private List<Criterion> buildCriteriaFromChunks(List<String> values) {
        List<Criterion> criteria = []
        int size = values.size()
        if (size > 0) {
            if (size == 1) {
                criteria.add(applyToAllSearchFields(defaultOperator, values[0]))
                return criteria
            } else if (size == 2) {
                if (Operator.forSymbol((String) values[0]) != Operator.NONE) {
                    def criteriaForAllFields = applyToAllSearchFields(Operator.forSymbol((String) values[0]), values[1])
                    criteria.add(criteriaForAllFields)
                    return criteria
                }
            } else {
                Operator op = Operator.forSymbol((String) values[1])
                if (op != Operator.NONE) {
                    if (op == Operator.IN) {
                        criteria.add(triplesChunksToCriteria(values))
                    } else {
                        def chunks = values.collate(3)
                        chunks.each { criteria.add(triplesChunksToCriteria(it)) }
                    }
                    return criteria
                }
            }
            criteria.add(applyToAllSearchFields(Operator.IN, values))
        }

        return criteria
    }

    /**
     * Create criteria from triple ["property", "operator", "value(s)"]
     * @param chunks
     * @return
     */
    private static Criterion triplesChunksToCriteria(List<String> chunks) {
        String nameElementString = chunks[0]
        String operatorSymbol = chunks[1]
        String[] values = chunks[2..<chunks.size()]
        String propertyName = searchFieldToPropertyName(SearchField.forName(nameElementString))
        if (propertyName == SearchField.NONE.value) {
            throw new IllegalArgumentException("Specified property name: $nameElementString is not supported.")
        }

        return buildSingleCriteria(Operator.forSymbol(operatorSymbol), propertyName, values.size() == 1 ? values[0] : values)
    }

    /**
     * Create single Restriction criterion for a specified operator
     * @param operator
     * @param propertyName
     * @param value
     * @return
     */
    private static Criterion buildSingleCriteria(Operator operator, String propertyName, Object value) {
        switch (operator) {
            case Operator.CONTAINS:
                return Restrictions.ilike(propertyName, value as String, MatchMode.ANYWHERE)
            case Operator.EQUALS:
                return Restrictions.ilike(propertyName, value as String, MatchMode.EXACT)
            case Operator.NOT_EQUALS:
                return Restrictions.not(Restrictions.ilike(propertyName, value as String, MatchMode.EXACT))
            case Operator.LIKE:
                return Restrictions.ilike(propertyName, value as String)
            case Operator.IN:
                List<String> valueList = new ArrayList<String>()
                value.each { valueList.add(it.toString()) }
                return Restrictions.in(propertyName, valueList)
            default:
                throw new IllegalArgumentException("Unsupported operator: ${operator}.")
        }
    }

    /**
     * Returns true if operator equals AND or OR
     * @param operator
     * @return
     */
    private static boolean isJunctionOperator(Operator operator) {
        return operator == Operator.AND || operator == Operator.OR
    }

    static Criterion expressionToCriteria(Operator operator, Criterion[] criteria) {
        switch (operator) {
            case Operator.AND:
                return Restrictions.and(criteria)
            case Operator.OR:
                return Restrictions.or(criteria)
        }
    }

    // TODO implement negation criterion
    private static Criterion negateExpression(Criterion c) {
        throw new NotImplementedException()
        // return Restrictions.not(c)
    }

    /**
     * If searchField is not specified, search query is applied to all supported properties
     * @param operator
     * @param value
     * @return
     */
    private static Criterion applyToAllSearchFields(Operator operator, Object value) {
        List<Criterion> criteria = []
        SearchField.values().each { SearchField field ->
            if (field != SearchField.NONE) {
                def singleCriteria = buildSingleCriteria(operator, searchFieldToPropertyName(field), value)
                criteria.add(singleCriteria)
            }
        }
        Criterion[] criteriaArray = criteria.collect { it }
        return expressionToCriteria(Operator.OR, criteriaArray)
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
}
