package nl.thehyve.datashowcase

import org.springframework.beans.factory.annotation.Autowired

class EnvironmentController {

    static responseFormats = ['json']

    @Autowired
    Environment dataShowcaseEnvironment

    def index() {
        respond environment: dataShowcaseEnvironment.currentEnvironment,
            grailsEnvironment: dataShowcaseEnvironment.grailsEnvironment,
            application: dataShowcaseEnvironment.applicationName,
            version: dataShowcaseEnvironment.applicationVersion
    }

}
