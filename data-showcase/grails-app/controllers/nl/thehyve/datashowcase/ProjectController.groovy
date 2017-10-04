package nl.thehyve.datashowcase

import org.springframework.beans.factory.annotation.Autowired

class ProjectController {

	static responseFormats = ['json']

    @Autowired
    ProjectService projectService

    def index() {
        respond projects: projectService.projects
    }

}
