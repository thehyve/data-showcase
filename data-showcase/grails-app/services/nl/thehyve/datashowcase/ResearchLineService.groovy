package nl.thehyve.datashowcase

import grails.gorm.transactions.Transactional

@Transactional(readOnly = true)
class ResearchLineService {

    List<String> getLinesOfResearch() {
        LineOfResearch.findAll().collect({
            it.name
        })
    }

}
