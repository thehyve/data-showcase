package nl.thehyve.datashowcase

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
