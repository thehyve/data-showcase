package nl.thehyve.datashowcase

import grails.util.Environment
import groovy.transform.CompileStatic
import nl.thehyve.datashowcase.exception.ConfigurationException
import org.springframework.stereotype.Component
import org.springframework.beans.factory.annotation.Value

/**
 * Class for utility functions dealing with the runtime environment,
 * e.g., to check is if the application is running in a test environment.
 * The environments are defined in {@link Constants}.
 */
@CompileStatic
@Component
class DataShowcaseEnvironment {

    @Value('${dataShowcase.environment}')
    String environment

    final boolean isInternalInstance() {
        if (![Constants.ENVIRONMENT_INTERNAL, Constants.ENVIRONMENT_PUBLIC].contains(environment)) {
            throw new ConfigurationException('Environment not configured.')
        }
        environment == Constants.ENVIRONMENT_INTERNAL
    }

    /**
     * Checks if the current Grails environment is any of the listed environments.
     * @param allowedEnvironments the allowed environments to check for.
     * @throws ConfigurationException iff the current environment is not any of the listed environments.
     */
    static checkGrailsEnvironment(Collection<String> ... allowedEnvironments) throws ConfigurationException {
        if (!(allowedEnvironments.any { Collection<String> environments ->
            environments.any { Environment.current.name.equalsIgnoreCase(it) }
        })) {
            throw new ConfigurationException("Action not allowed in environment ${Environment.current}.")
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
