package nl.thehyve.datashowcase


import nl.thehyve.datashowcase.enumeration.LogoType
import org.springframework.beans.factory.annotation.Value

class FileController {
    static responseFormats = ['json', 'jpg', 'png']

    @Value('${dataShowcase.vuLogo}')
    def vuLogoPath
    @Value('${dataShowcase.ntrLogo}')
    def ntrLogoPath

    private final static defaultPath = "grails-app/assets/images/placeholder.jpg"

    /**
     * Finds the path of a logo
     * and writes an image to an output stream
     * @params type - type of the logo: NTR or VU
     * @return Image outputStream
     */
    def getLogo(String type) {
        def path = ''
        LogoType typeEnum

        try {
            typeEnum = LogoType.valueOf(type)
        } catch (IllegalArgumentException e) {
            typeEnum = LogoType.DEFAULT
        }


        if (typeEnum == LogoType.NTR) {
            path = ntrLogoPath == 'default' ? defaultPath : ntrLogoPath
        } else if (typeEnum == LogoType.VU) {
            path = vuLogoPath == 'default' ? defaultPath : vuLogoPath
        } else {
            path = defaultPath
        }

        File image = new File(path)
        if (!image.exists()) {
            image = getDefaultLogo()
        }

        response.setContentType("application/jpg")
        OutputStream out = response.getOutputStream()
        out.write(image.bytes)
        out.close()
    }

    private static File getDefaultLogo(){
        return new File(defaultPath)
    }
}
