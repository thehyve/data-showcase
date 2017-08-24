package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional
import nl.thehyve.datashowcase.representation.ProjectRepresentation
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired

@Transactional(readOnly = true)
class ProjectService {

    @Autowired
    ModelMapper modelMapper

    List<ProjectRepresentation> getProjects() {
        Project.findAll().collect({
            modelMapper.map(it, ProjectRepresentation)
        })
    }

}
