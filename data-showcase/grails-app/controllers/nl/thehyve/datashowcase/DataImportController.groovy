/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase

import grails.converters.JSON

import org.grails.web.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.multipart.MultipartHttpServletRequest

class DataImportController {
    static responseFormats = ['json', 'xml']

    @Autowired
    DataImportService dataImportService
    @Autowired
    TokenService tokenService

    def upload() {
        if (!checkToken(params.requestToken)) {
            return
        }

        if (request instanceof MultipartHttpServletRequest) {
            Iterator names = request.getFileNames()
            if (names.hasNext()) {
                def fileName = names.next()
                MultipartFile file = request.getFile(fileName)
                if (file.empty) {
                    response.status = 400
                    respond error: "File cannot be empty."
                    return
                } else {
                    log.info('Parsing the file...')
                    def json = file.inputStream.withReader {
                        r -> JSON.parse(r)
                    }
                    if (json) {
                        log.info('Uploading the file...')
                        dataImportService.upload((JSONObject) json)
                        log.info('Data successfully uploaded!')
                        respond message: "Data successfully uploaded"
                        return response.status = 200
                    } else {
                        response.status = 400
                        respond error: "$fileName is not a valid JSON."
                        return
                    }
                }
            } else {
                response.status = 400
                respond error: "Data file is missing."
                return
            }
        } else {
            response.status = 400
            respond error: "Data file is missing."
            return
        }

    }

    private boolean checkToken(String requestToken) {
        if (!requestToken?.trim()) {
            response.status = 401
            respond error: "requestToken is required to upload the data"
            return false
        }

        if (!tokenService.isValid(requestToken)) {
            response.status = 401
            respond error: "requestToken: $requestToken is invalid"
            return false
        }
        return true
    }

}
