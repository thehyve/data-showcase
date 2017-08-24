package nl.thehyve.datashowcase

import grails.util.Environment
import org.springframework.beans.factory.annotation.Value

class EnvironmentController {

    static responseFormats = ['json']

    @Value('${dataShowcase.environment}')
    String environment

    def index() {
        respond environment: environment,
            grailsEnvironment: Environment.current.name,
            application: grailsApplication.metadata.getApplicationName(),
            version: grailsApplication.metadata.getApplicationVersion()
    }

}
