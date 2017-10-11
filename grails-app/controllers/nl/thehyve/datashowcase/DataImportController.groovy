package nl.thehyve.datashowcase

import grails.converters.JSON

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
                    response.status = 400
                    render("File cannot be empty.")
                } else {
                    def json = file.inputStream.withReader {
                        r -> JSON.parse(r)
                    }
                    if (json) {
                        dataImportService.upload((JSONObject) json)
                    } else {
                        response.status = 400
                        render("$fileName is not a valid JSON.")
                    }
                }
            }
        } else {
            response.status = 400
            render("Data file is missing.")
        }
    }

    def private checkToken(String requestToken) {
        if (!requestToken?.trim()) {
            response.status = 401
            render("requestToken is required to upload the data")
        }
        if (!ACCESS_TOKEN) {
            response.status = 500
            render("accessToken is not configured.")
        }
        if (!bcryptEncoder.matches(requestToken, ACCESS_TOKEN)) {
            response.status = 401
            render("requestToken: $requestToken is invalid")
        }
    }

}
