/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import nl.thehyve.datashowcase.Environment
import nl.thehyve.datashowcase.StartupMessage
import nl.thehyve.datashowcase.search.SearchCriteriaBuilder
import org.modelmapper.ModelMapper
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

// Place your Spring DSL code here
beans = {
    dataShowcaseEnvironment(Environment) {}
    modelMapper(ModelMapper) {}
    startupMessage(StartupMessage) {}
    bcryptEncoder(BCryptPasswordEncoder) {}
    searchCriteriaBuilder(SearchCriteriaBuilder) {}
}
