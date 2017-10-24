/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase


import nl.thehyve.datashowcase.enumeration.LogoType
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.UrlResource

class FileController {
    static responseFormats = ['json', 'jpg', 'png']

    @Value('${dataShowcase.vuLogo}')
    def vuLogoPath
    @Value('${dataShowcase.ntrLogo}')
    def ntrLogoPath

    private final static defaultPath = 'images/placeholder.jpg'

    /**
     * Finds the path of a logo
     * and writes an image to an output stream
     * @params type - type of the logo: NTR or VU
     * @return Image outputStream
     */
    def getLogo(String type) {
        LogoType typeEnum

        try {
            typeEnum = LogoType.valueOf(type)
        } catch (IllegalArgumentException e) {
            return response.status = 400
        }

        def path
        if (typeEnum == LogoType.NTR) {
            path = ntrLogoPath == 'default' ? defaultPath : ntrLogoPath
        } else if (typeEnum == LogoType.VU) {
            path = vuLogoPath == 'default' ? defaultPath : vuLogoPath
        } else {
            return response.status = 400
        }

        Resource image
        if (path == defaultPath) {
            URL imageUrl = getClass().getClassLoader().getResource(defaultPath)
            image = new UrlResource(imageUrl)
        } else {
            image = new FileSystemResource(path)
            if (!image.exists()) {
                return response.status = 500
            }
        }
        render file: image.inputStream, contentType: 'image/jpg'
    }

}
