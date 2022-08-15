class LoginUserApiModel {
    constructor(model) {
        this.username = model.username;
        this.password = model.password;
        this.token = model.token;
        this.ip = model.ip;
    }
}

module.exports = LoginUserApiModel;
