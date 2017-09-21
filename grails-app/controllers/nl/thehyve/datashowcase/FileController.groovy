package nl.thehyve.datashowcase


import nl.thehyve.datashowcase.enumeration.LogoType
import org.springframework.beans.factory.annotation.Value

class FileController {
    static responseFormats = ['json', 'jpg', 'png']

    @Value('${vuLogo}')
    def vuLogoPath
    @Value('${ntrLogo}')
    def ntrLogoPath

    /**
     * Finds the path of a logo
     * and writes an image to an output stream
     * @params type - type of the logo: NTR or VU
     * @return Image outputStream
     */
    def getLogos(String type) {
        def path = ''
        LogoType typeEnum

        try {
            typeEnum = LogoType.valueOf(type)
        } catch (IllegalArgumentException e) {
            return response.status = 404
        }

        if (typeEnum == LogoType.NTR) {
            path = ntrLogoPath
        } else if (typeEnum == LogoType.VU) {
            path = vuLogoPath
        }

        File image = new File(path)
        if (!image.exists()) {
            return response.status = 404
        } else {
            response.setContentType("application/jpg")
            OutputStream out = response.getOutputStream()
            out.write(image.bytes)
            out.close()
        }

    }
}
