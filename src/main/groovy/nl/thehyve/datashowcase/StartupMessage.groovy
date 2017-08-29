package nl.thehyve.datashowcase

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationListener
import org.springframework.context.event.ContextRefreshedEvent
import org.springframework.stereotype.Component

@Slf4j
@Component
class StartupMessage implements ApplicationListener<ContextRefreshedEvent> {

    @Autowired
    Environment dataShowcaseEnvironment

    @Override
    void onApplicationEvent(ContextRefreshedEvent event) {
        log.info "Starting ${dataShowcaseEnvironment.applicationName} ${dataShowcaseEnvironment.applicationVersion} ..."
        log.info "Data showcase environment: ${dataShowcaseEnvironment.currentEnvironment}"
        log.info "Grails environment: ${dataShowcaseEnvironment.grailsEnvironment}"
    }

}
