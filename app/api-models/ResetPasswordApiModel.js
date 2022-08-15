class ResetPasswordApiModel {
    constructor(token, body) {
        this.token = token;

        if(body.password !== undefined) {
            this.password = body.password;
        }

        if(body.passwordConfirmed !== undefined) {
            this.passwordConfirmed = body.passwordConfirmed;
        }
    }
}

module.exports = ResetPasswordApiModel;
