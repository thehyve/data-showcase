/* (c) Copyright 2017, tranSMART Foundation, Inc. */

package config

import base.AuthAdapter

class Config {
    //Constants
    //$ gradle -DbaseUrl=http://some.domain.net/ test
    public static final String BASE_URL = System.getProperty('baseUrl') != null ? System.getProperty('baseUrl') : 'http://localhost:8080/'
    public static final AuthAdapter authAdapter = new AuthAdapterBasic()

    //settings
    public static final boolean AUTH_NEEDED = false
}
