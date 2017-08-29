package nl.thehyve.datashowcase

import org.springframework.beans.factory.annotation.Autowired

class TreeController {
	static responseFormats = ['json']

    @Autowired
    TreeService treeService
	
    def index() {
        respond tree_nodes: treeService.nodes
    }
}
