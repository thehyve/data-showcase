package base

import groovyx.net.http.HttpConfig.Request

abstract class AuthAdapter {
    abstract void authenticate(Request request, userId)
}