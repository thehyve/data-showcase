package base

interface ContentTypeFor {
    String HAL = 'application/hal+json',
           XML = 'application/xml',
           OCTETSTREAM = 'application/octet-stream',
           PROTOBUF = 'application/x-protobuf',
           JSON = 'application/json'
}