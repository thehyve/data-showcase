/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import grails.databinding.BindUsing
import javax.persistence.OneToOne
import javax.persistence.CascadeType


/**
 * An item represents a variable in a study or survey.
 * Besides links to the concept and project it belongs to,
 * there can be associated values, aggregated (summary) data and
 * associated keywords.
 */
class Item {

    /**
     * A unique code for the variable.
     */
    String name

    /**
     * The full path of the item that can be used in tranSMART
     */
    String itemPath

    /**
     * Marks if the item is public or not. If it is public, the item may appear in public
     * instances of the data showcase and the associated summary data is more extensive.
     */
    boolean publicItem

    /**
     * The concept that the item represents in a project.
     */
    @BindUsing({ obj, source ->
        String conceptCode = source['concept']
        Concept.findByConceptCode(conceptCode)
    })
    Concept concept

    /**
     * The project (survey) the item belongs to.
     */
    static belongsTo = [project: Project]

    /**
     * Summary data for the variable: aggregate values and value frequencies.
     */
    @BindUsing({ obj, source ->
        def s = source['summary']
        def summary = s instanceof Summary ? s : new Summary(s)
        if (s.values) {
            s.values.each {
                summary.addToValues(it)
            }
        }
        summary
    })
    @OneToOne(cascade=CascadeType.PERSIST)
    Summary summary

    String getLabel() {
        concept.label
    }

    String getLabelLong() {
        concept.labelLong
    }

    String getLabelNl() {
        concept.labelNl
    }

    String getLabelNlLong() {
        concept.labelNlLong
    }

    List<Keyword> getKeywords() {
        concept.keywords
    }

    String getType() {
        concept.variableType
    }

    static mapping = {
        version false
    }

    static constraints = {
        name unique: true
        itemPath maxSize: 700
    }

}
