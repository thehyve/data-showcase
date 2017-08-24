package nl.thehyve.datashowcase

import org.springframework.beans.factory.annotation.Autowired

class KeywordController {

	static responseFormats = ['json']

    @Autowired
    KeywordService keywordService

    def index() {
        respond keywords: keywordService.keywords
    }

}
