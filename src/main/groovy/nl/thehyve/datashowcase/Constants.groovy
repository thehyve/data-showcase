package nl.thehyve.datashowcase

import groovy.transform.CompileStatic

@CompileStatic
class Constants {

    /**
     * Name of the datashowcase environment for public instances.
     * This allows only public items and shows limited summary data.
     */
    static final String ENVIRONMENT_PUBLIC = 'public'

    /**
     * Name of the datashowcase environment for internal instances.
     * This allows both public and non-public items and shows extensive summary data.
     */
    static final String ENVIRONMENT_INTERNAL = 'internal'

    /**
     * Name of the Grails environment for testing public instances.
     */
    static final String PUBLIC_TEST_ENVIRONMENT = 'test'

    /**
     * Name of the Grails environment for testing internal instances.
     */
    static final String INTERNAL_TEST_ENVIRONMENT = 'testInternal'

    /**
     * Name of the Grails environment for developing public instances.
     */
    static final String PUBLIC_DEV_ENVIRONMENT = 'development'

    /**
     * Name of the Grails environment for developing internal instances.
     */
    static final String INTERNAL_DEV_ENVIRONMENT = 'developmentInternal'

    static final Set<String> INTERNAL_ENVIRONMENTS = [INTERNAL_DEV_ENVIRONMENT, INTERNAL_TEST_ENVIRONMENT] as Set<String>

    static final Set<String> PUBLIC_ENVIRONMENTS = [PUBLIC_DEV_ENVIRONMENT, PUBLIC_TEST_ENVIRONMENT] as Set<String>

    static final Set<String> TEST_ENVIRONMENTS = [INTERNAL_TEST_ENVIRONMENT, PUBLIC_TEST_ENVIRONMENT] as Set<String>

    static final Set<String> DEV_ENVIRONMENTS = [INTERNAL_DEV_ENVIRONMENT, PUBLIC_DEV_ENVIRONMENT] as Set<String>

}
