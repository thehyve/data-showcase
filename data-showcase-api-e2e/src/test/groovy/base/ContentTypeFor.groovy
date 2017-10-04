/*
 * Copyright (c) 2017  The Hyve B.V. 
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

package base

interface ContentTypeFor {
    String HAL = 'application/hal+json',
           XML = 'application/xml',
           OCTETSTREAM = 'application/octet-stream',
           PROTOBUF = 'application/x-protobuf',
           JSON = 'application/json'
}