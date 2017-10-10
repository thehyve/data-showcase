package nl.thehyve.datashowcase

import grails.databinding.BindUsing

/**
 * Entity class to store projects (surveys).
 */
class Project {

    /**
     * The project name (unique)
     */
    String name

    /**
     * A description of the project (survey).
     */
    String description

    /**
     * The line of research the project belongs to.
     */
    @BindUsing({ obj, source ->
        LineOfResearch existingResearchLine = LineOfResearch.findByName(source['lineOfResearch'])
        existingResearchLine ?: new LineOfResearch(name: source['lineOfResearch'])
    })
    LineOfResearch lineOfResearch

    @Override
    String toString() {
        name
    }

    /**
     * The items associated with the project.
     */
    static hasMany = [items: Item]

    static mapping = {
        version false
    }

    static constraints = {
        name unique: true
    }

}
