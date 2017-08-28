import nl.thehyve.datashowcase.Environment
import nl.thehyve.datashowcase.StartupMessage
import nl.thehyve.datashowcase.mapping.ItemMapper
import org.modelmapper.ModelMapper

// Place your Spring DSL code here
beans = {
    dataShowcaseEnvironment(Environment) {}
    modelMapper(ModelMapper) {}
    itemMapper(ItemMapper) {}
    startupMessage(StartupMessage) {}
}
