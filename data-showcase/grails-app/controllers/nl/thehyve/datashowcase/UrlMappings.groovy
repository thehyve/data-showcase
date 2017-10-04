/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

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
        "/api/data_import/upload"(controller: 'dataImport', action: 'upload', method: 'POST')

        if (Environment.current.name in (Constants.DEV_ENVIRONMENTS + Constants.TEST_ENVIRONMENTS)) {
            "/api/test/clearDatabase"(controller: 'test', action: 'clearDatabase')
        }
        if (Environment.current.name in Constants.PUBLIC_ENVIRONMENTS) {
            "/api/test/createPublicData"(controller: 'test', action: 'createPublicData')
        }
        if (Environment.current.name in Constants.INTERNAL_ENVIRONMENTS) {
            "/api/test/createInternalData"(controller: 'test', action: 'createInternalData')
        }

    }
}
