package nl.thehyve.datashowcase


import grails.converters.*
import org.springframework.beans.factory.annotation.Autowired

class TreeController {
	static responseFormats = ['json']

    @Autowired
    TreeService treeService
	
    def index() {
        treeService.getNodes() as JSON
    }
}
