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

}
