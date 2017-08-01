package data


class UserRepo {

    Map users =[
            default: [username: 'admin', password: 'admin']
    ]

    def getUser(username) {
        if (!users[username]) {
            throw new MissingResourceException("user: ${username} is not defined in the UserRepo",'UserRepo','UserRepo')
        }
        users[username]
    }
}
