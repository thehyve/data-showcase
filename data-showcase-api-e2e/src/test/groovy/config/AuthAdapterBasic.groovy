package config

import base.AuthAdapter
import data.UserRepo
import groovyx.net.http.HttpConfig

class AuthAdapterBasic extends AuthAdapter {

    UserRepo userRepo = new UserRepo()

    @Override
    void authenticate(HttpConfig.Request request, userId) {
        def user = userRepo.getUser(userId)
        request.auth.basic(user['username'], user['password'])
    }
}
