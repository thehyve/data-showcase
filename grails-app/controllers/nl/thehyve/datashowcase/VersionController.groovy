package nl.thehyve.datashowcase

import grails.core.GrailsApplication

class VersionController {

    GrailsApplication grailsApplication

    def index() {
        [version: grailsApplication.metadata.getApplicationVersion()]
    }
}
