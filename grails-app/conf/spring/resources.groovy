import nl.thehyve.datashowcase.Environment
import nl.thehyve.datashowcase.StartupMessage
import nl.thehyve.datashowcase.mapping.ItemMapper
import org.modelmapper.ModelMapper
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

// Place your Spring DSL code here
beans = {
    dataShowcaseEnvironment(Environment) {}
    modelMapper(ModelMapper) {}
    itemMapper(ItemMapper) {}
    startupMessage(StartupMessage) {}
    bcryptEncoder(BCryptPasswordEncoder) {}
}
