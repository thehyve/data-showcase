/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package nl.thehyve.datashowcase.mapping

import groovy.transform.CompileStatic
import nl.thehyve.datashowcase.Environment
import nl.thehyve.datashowcase.Item
import nl.thehyve.datashowcase.representation.InternalItemRepresentation
import nl.thehyve.datashowcase.representation.ItemRepresentation
import nl.thehyve.datashowcase.representation.PublicItemRepresentation
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
@CompileStatic
class ItemMapper {

    @Autowired
    ModelMapper modelMapper

    @Autowired
    Environment dataShowcaseEnvironment

    @Lazy
    Closure<ItemRepresentation> map = (dataShowcaseEnvironment.internalInstance) ?
            { Item item ->
                modelMapper.map(item, InternalItemRepresentation.class)
            } as Closure<ItemRepresentation>
            :
            { Item item ->
                modelMapper.map(item, PublicItemRepresentation.class)
            } as Closure<ItemRepresentation>

}
