package nl.thehyve.datashowcase

/**
 * The entity representing keywords used to annotate items (variables).
 */
class Keyword {

    String keyword

    @Override
    String toString() {
        keyword
    }

    static constraints = {
        keyword unique: true
    }

}
