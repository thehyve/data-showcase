package nl.thehyve.datashowcase

import grails.util.Environment

class UrlMappings {

    static mappings = {

        "/"(uri: '/index.html')

        "/api/environment"(controller: 'environment', includes: ['index'])
        "/api/items"(resources: 'item', includes: ['index', 'show'])
        "/api/keywords"(controller: 'keyword', includes: ['index'])
        "/api/projects"(controller: 'project', includes: ['index'])
        "/api/lines_of_research"(controller: 'researchLine', includes: ['index'])
        "/api/tree_nodes"(controller: 'tree', includes: ['index'])
        "/api/file/logo/${type}"(controller: 'file', includes: ['getLogo'])

        if (Environment.current.name in [Constants.PUBLIC_TEST_ENVIRONMENT, Constants.INTERNAL_TEST_ENVIRONMENT]) {
            "/api/test/clearDatabase"(controller: 'test', action: 'clearDatabase')
        }
        if (Environment.current.name == Constants.PUBLIC_TEST_ENVIRONMENT) {
            "/api/test/createPublicData"(controller: 'test', action: 'createPublicData')
        }
        if (Environment.current.name == Constants.INTERNAL_TEST_ENVIRONMENT) {
            "/api/test/createInternalData"(controller: 'test', action: 'createInternalData')
        }

    }
}
