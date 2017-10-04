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
