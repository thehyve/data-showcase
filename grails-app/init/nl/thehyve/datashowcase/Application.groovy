package nl.thehyve.datashowcase

import grails.boot.GrailsApp
import grails.boot.config.GrailsAutoConfiguration
import groovy.util.logging.Slf4j

@Slf4j
class Application extends GrailsAutoConfiguration {
    static void main(String[] args) {
        GrailsApp.run(Application, args)
    }

    void onStartup(Map<String, Object> event) {
        def metadata = grailsApplication.metadata
        log.info "Starting ${metadata.getApplicationName()} ${metadata.getApplicationVersion()} ..."
    }
}
