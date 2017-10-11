import nl.thehyve.datashowcase.Environment
import nl.thehyve.datashowcase.StartupMessage
import nl.thehyve.datashowcase.deserialisation.JsonDataDeserializer
import nl.thehyve.datashowcase.mapping.ItemMapper
import org.modelmapper.ModelMapper
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import nl.thehyve.datashowcase.DataImportController

// Place your Spring DSL code here
beans = {
    dataShowcaseEnvironment(Environment) {}
    modelMapper(ModelMapper) {}
    itemMapper(ItemMapper) {}
    startupMessage(StartupMessage) {}
    jsonDataDeserializer(JsonDataDeserializer) {}
    bcryptEncoder(BCryptPasswordEncoder) {}

    String token = application.config.dataShowcase.accessToken
    if(token){
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder()
        String hashedToken = encoder.encode(token)
        'nl.thehyve.datashowcase.DataImportController'(DataImportController) {
            ACCESS_TOKEN = hashedToken
        }
    }
}
