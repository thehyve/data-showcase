package nl.thehyve.datashowcase

import grails.util.Environment

class UrlMappings {

    static mappings = {

        "/"(uri: '/index.html')

        "/api/items"(controller: 'item', includes: ['index', 'show'])
        "/api/keywords"(controller: 'keyword', includes: ['index'])
        "/api/projects"(controller: 'project', includes: ['index'])
        "/api/lines_of_research"(controller: 'researchLine', includes: ['index'])
        "/api/tree_nodes"(controller: 'tree', includes: ['index'])

        if (Environment.current.name in ['test', 'testInternal']) {
            "/api/test/clearDatabase"(controller: 'test', action: 'clearDatabase')
        }

    }
}
