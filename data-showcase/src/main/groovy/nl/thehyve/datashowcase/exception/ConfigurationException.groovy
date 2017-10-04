package nl.thehyve.datashowcase.exception

import groovy.transform.InheritConstructors
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
@InheritConstructors
class ConfigurationException extends RuntimeException {
}
