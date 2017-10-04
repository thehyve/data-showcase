/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import grails.converters.JSON

class BootStrap {

    def init = { servletContext ->
        log.info "Registering default marshaller for enumerations ..."
        JSON.registerObjectMarshaller(Enum, { Enum e -> e.name() })
    }
    def destroy = {
    }
}
