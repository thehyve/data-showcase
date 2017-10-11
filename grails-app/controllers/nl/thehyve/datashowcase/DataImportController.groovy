package nl.thehyve.datashowcase

import grails.converters.JSON
import nl.thehyve.datashowcase.exception.AccessDeniedException
import nl.thehyve.datashowcase.exception.ConfigurationException
import nl.thehyve.datashowcase.exception.InvalidFileException
import nl.thehyve.datashowcase.exception.InvalidRequestException
import org.grails.web.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.multipart.MultipartHttpServletRequest
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

class DataImportController {
    static responseFormats = ['json', 'xml']

    @Autowired
    DataImportService dataImportService
    @Autowired
    BCryptPasswordEncoder bcryptEncoder

    String ACCESS_TOKEN

    def upload() {
        checkToken(params.requestToken)

        if (request instanceof MultipartHttpServletRequest) {
            Iterator names = request.getFileNames()
            if (names.hasNext()) {
                def fileName = names.next()
                MultipartFile file = request.getFile(fileName)
                if (file.empty) {
                    throw new InvalidFileException("File cannot be empty.")
                } else {
                    def json = file.inputStream.withReader {
                        r -> JSON.parse(r)
                    }
                    if (json) {
                        dataImportService.upload((JSONObject) json)
                    } else {
                        throw new InvalidFileException("$fileName is not a valid JSON.")
                    }
                }
            }
        } else {
            throw new InvalidRequestException()
        }
    }

    def private checkToken(String requestToken) {
        if(!requestToken?.trim()) {
            throw new AccessDeniedException("requestToken is required to upload the data")
        }
        if (!ACCESS_TOKEN) {
            throw new ConfigurationException("accessToken is not configured.")
        }
        if (!bcryptEncoder.matches(requestToken, ACCESS_TOKEN)) {
            throw new AccessDeniedException("requestToken: $requestToken is invalid")
        }
    }

}
