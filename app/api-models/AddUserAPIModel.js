class AddUserApiModel {
    constructor(body) {
        if (body.firstName !== undefined) {
            this.firstName = body.firstName;
        }
        if (body.lastName !== undefined) {
            this.lastName = body.lastName;
        }
        if (body.username !== undefined) {
            this.username = body.username;
        }
        if (body.password !== undefined) {
            this.password = body.password;
        }
        if (body.email !== undefined) {
            this.email = body.email;
        }
        if (body.phoneNumber !== undefined) {
            this.phoneNumber = body.phoneNumber;
        }
        if (body.passwordConfirmed !== undefined) {
            this.passwordConfirmed = body.passwordConfirmed;
        }
        if (body.imageName !== undefined) {
            this.imageName = body.imageName;
        }
        if (body.isEnabled !== undefined) {
            this.isEnabled = body.isEnabled;
        }
    }
}

module.exports = AddUserApiModel;
