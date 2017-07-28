package nl.thehyve.datashowcase

import grails.core.GrailsApplication
import org.springframework.beans.factory.annotation.Autowired

class VersionController {

    static responseFormats = ['json']

    @Autowired
    GrailsApplication grailsApplication

    def index() {
        def version = grailsApplication.metadata.getApplicationVersion()
        def result = [version: version] as Map
        respond result
    }

}
