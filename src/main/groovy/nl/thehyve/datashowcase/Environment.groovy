package nl.thehyve.datashowcase

import grails.core.GrailsApplication
import groovy.transform.CompileStatic
import nl.thehyve.datashowcase.enumeration.DataShowcaseEnvironmentType
import nl.thehyve.datashowcase.exception.ConfigurationException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.beans.factory.annotation.Value

/**
 * Class for utility functions dealing with the runtime environment,
 * e.g., to check is if the application is running in a test environment.
 * The grails environments are defined in {@link Constants}.
 */
@CompileStatic
@Component
class Environment {

    @Autowired
    GrailsApplication grailsApplication

    @Value('${dataShowcase.environment}')
    DataShowcaseEnvironmentType currentEnvironment = DataShowcaseEnvironmentType.None

    final boolean isInternalInstance() {
        if (currentEnvironment == DataShowcaseEnvironmentType.None) {
            throw new ConfigurationException('Data showcase environment not configured.')
        }
        currentEnvironment == DataShowcaseEnvironmentType.Internal
    }

    String getApplicationName() {
        grailsApplication.metadata.getApplicationName()
    }

    String getApplicationVersion() {
        grailsApplication.metadata.getApplicationVersion()
    }

    static String getGrailsEnvironment() {
        grails.util.Environment.current.name
    }

    /**
     * Checks if the current Grails environment is any of the listed environments.
     * @param environments the environments to check for.
     * @return true iff the current Grails environment is any of the listed environments.
     */
    static boolean grailsEnvironmentIn(Collection<String> ... environments) throws ConfigurationException {
        environments.any { Collection<String> collection ->
            collection.any { env -> grailsEnvironment.equalsIgnoreCase(env) }
        }
    }

    /**
     * Checks if the current Grails environment is any of the listed environments.
     * @param environments the environments to check for.
     * @return true iff the current Grails environment is any of the listed environments.
     */
    static boolean grailsEnvironmentIn(String ... environments) throws ConfigurationException {
        grailsEnvironmentIn(Arrays.asList(environments))
    }

    /**
     * Checks if the current Grails environment is any of the listed environments.
     * @param allowedEnvironments the allowed environments to check for.
     * @throws ConfigurationException iff the current environment is not any of the listed environments.
     */
    static checkGrailsEnvironment(Collection<String> ... allowedEnvironments) throws ConfigurationException {
        if (!grailsEnvironmentIn(allowedEnvironments)) {
            throw new ConfigurationException("Action not allowed in environment ${grails.util.Environment.current}.")
        }
    }

    /**
     * Checks if the current Grails environment is any of the listed environments.
     * @param allowedEnvironments the allowed environments to check for.
     * @throws ConfigurationException iff the current environment is not any of the listed environments.
     */
    static checkGrailsEnvironment(String ... allowedEnvironments) throws ConfigurationException {
        checkGrailsEnvironment(Arrays.asList(allowedEnvironments))
    }

}
