package nl.thehyve.datashowcase

import org.springframework.beans.factory.annotation.Autowired

class ResearchLineController {

	static responseFormats = ['json']

    @Autowired
    ResearchLineService researchLineService

    def index() {
        respond linesOfResearch: researchLineService.linesOfResearch
    }

}
