package nl.thehyve.datashowcase

/**
 * Entity class to store lines of research.
 */
class LineOfResearch {

    /**
     * The name of the research line (unique).
     */
    String name

    @Override
    String toString() {
        name
    }

    static constraints = {
        name unique: true
    }
}
