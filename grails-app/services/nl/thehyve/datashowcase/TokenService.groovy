package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.CommandLineRunner
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

@Transactional
class TokenService implements CommandLineRunner {

    @Autowired
    BCryptPasswordEncoder bcryptEncoder

    @org.springframework.beans.factory.annotation.Value('${dataShowcase.accessToken}')
    String configAccessToken

    public static String hashedAccessToken

    private String defaultToken = "<configure a secure token>"

    @Override
    void run(String... args) throws Exception {
        if(configAccessToken == defaultToken || !configAccessToken?.trim()) {
            throw new Exception("Access token is not configured correctly. Specify a secure token in external config file.")
        }
        String hashedToken = bcryptEncoder.encode(configAccessToken)
        hashedAccessToken = hashedToken
    }

    boolean isValid(String requestToken) {
        return bcryptEncoder.matches(requestToken, hashedAccessToken)
    }
}
