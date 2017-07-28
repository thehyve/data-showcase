package nl.thehyve.datashowcase

class UrlMappings {

    static mappings = {
        get "/$controller(.$format)?"(action:"index")
        get "/$controller/$id(.$format)?"(action:"show")
        post "/$controller(.$format)?"(action:"save")

        "/"(uri: '/index.html')

    }
}
