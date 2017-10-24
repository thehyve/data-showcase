/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import groovy.transform.CompileStatic

@CompileStatic
class Constants {

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
