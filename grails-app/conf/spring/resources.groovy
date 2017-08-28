import nl.thehyve.datashowcase.DataShowcaseEnvironment
import nl.thehyve.datashowcase.mapping.ItemMapper
import org.modelmapper.ModelMapper

// Place your Spring DSL code here
beans = {
    dataShowcaseEnvironment(DataShowcaseEnvironment) {}
    modelMapper(ModelMapper) {}
    itemMapper(ItemMapper) {}
}
