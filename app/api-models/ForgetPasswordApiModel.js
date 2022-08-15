class ForgetPasswordApiModel {
    constructor(body) {
        if(body.email !== undefined) {
            this.email = body.email;
        }
    }
}

module.exports = ForgetPasswordApiModel;
