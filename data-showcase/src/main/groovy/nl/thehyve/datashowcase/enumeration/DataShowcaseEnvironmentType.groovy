/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase.enumeration

/**
 * Data showcase environment type (public or internal).
 */
enum DataShowcaseEnvironmentType {

    /**
     * Name of the data showcase environment type for public instances.
     * This allows only public items and shows limited summary data.
     */
    Public,

    /**
     * Name of the data showcase environment type for internal instances.
     * This allows both public and non-public items and shows extensive summary data.
     */
    Internal,

    /**
     * Default value for the data showcase environment type if none is selected.
     */
    None

}
