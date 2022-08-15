const PasswordResetManager = require(
    '../../../app/services/PasswordResetManager');
const logger = require('../../../app/providers/logger-factory')('test');

describe('PasswordReset Manager service', () => {
    let passwordResetManager;
    let usersList = [];

    class User {
        constructor(model) {
            this.id = model.id;
            this.email = model.email;
            this.resetPasswordToken = model.resetPasswordToken;
            this.resetPasswordExpires = model.resetPasswordExpires;

            usersList.push(this);
        }

        set(model) {
            usersList.pop();
            usersList.push(model);
            return this;
        }

        save() {
            return usersList;
        }

        static findOne({
            email,
            resetPasswordToken,
            resetPasswordExpires
        }) {
            if (email) {
                if (typeof email !== 'string')
                    throw new Error('EMAIL_SHOULD_BE_STRING');

                const result = usersList.find(ref => ref.email ==
                    email);
                return result;
            } else {
                const result = usersList.find(ref => ref.resetPasswordToken ==
                    resetPasswordToken);

                return result;
            }

        }

        setResetPasswordToken() {
            return '5c3c5dd7f8248e0cd31f0508';
        }

        setResetPasswordExpires() {
            return Date.now();
        }

        setPassword(password, passwordConfirmed) {
            if (password !== passwordConfirmed)
                throw new Error('NOT_IDENTICAL');
        }
    }


    beforeEach(() => {

        function nodemailer(email, text) {
            return true;
        }

        passwordResetManager = new PasswordResetManager({
            User,
            nodemailer
        }, logger);
    });

    describe('Send forget password email', () => {

        it('Should return user not found', async () => {
            let model = {
                email: 'example1665@example.com'
            };
            const result = await passwordResetManager
                .forgetPassword(model);

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(501);
        });

        it('Should return password reset sent to your email',
            async () => {
                let newDate = new Date();

                newDate = newDate.setMinutes(
                    newDate.getMinutes() -
                    30);

                let model = new User({
                    email: 'example1@example.com',
                    resetPasswordToken: '5c3c5dd7f8248e0cd31f0508',
                    resetPasswordExpires: newDate
                });
                const result = await passwordResetManager
                    .forgetPassword(model);

                expect(result.success).toBeTruthy();
                expect(result.httpMethodCode).toBe(200);
            });

        it('Should return Password reset sent to your email.',
            async () => {
                let newDate = new Date();

                newDate = newDate.setMinutes(
                    newDate.getMinutes() +
                    30);

                let model = new User({
                    email: 'example17@example.com',
                    resetPasswordToken: '5c3c5dd7f8248e0cd31f0508',
                    resetPasswordExpires: newDate
                });
                const result = await passwordResetManager
                    .forgetPassword(model);

                expect(result.success).toBeFalsy();
                expect(result.httpMethodCode).toBe(405);
            });

        it('should return "BAD_REQUEST" when errors occures.',
            async () => {
                let model = {
                    email: 1,
                };

                const result = await passwordResetManager
                    .forgetPassword(model);

                expect(result.success).toBeFalsy();
                expect(result.httpMethodCode).toBe(400);
            });
    });

    describe('Send reset password email', () => {

        it('Should return Password reset token is invalid or has expired', async () => {
            let model = {
                resetPasswordToken: 'skvkjsbvkjbskjbvksjdjb',
                resetPasswordExpires: Date.now()
            };

            const result = await passwordResetManager
                .resetPassword(model);

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(501);
        });

        it('Should return Password id not indentical with confirm password', async () => {
            let model = new User({
                email: 'example17@example.com',
                resetPasswordToken: '5c3c5dd7f8248e0cd31f0508',
                resetPasswordExpires: Date.now(),
                password: '12345678',
                passwordConfirmed: '1234567722938217'
            });

            const result = await passwordResetManager
                .resetPassword({
                    token: '5c3c5dd7f8248e0cd31f0508',
                    password: '12345678',
                    passwordConfirmed: '1234567722938217'
                });

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(422);
        });

        it('Should return Password id not indentical with confirm password', async () => {
            let model = new User({
                email: 'example17@example.com',
                resetPasswordToken: '5c3c5dd7f8248e0cd31f0508s',
                resetPasswordExpires: Date.now(),
                password: '12345678',
                passwordConfirmed: '1234567722938217'
            });

            const result = await passwordResetManager
                .resetPassword({
                    token: '5c3c5dd7f8248e0cd31f0508s',
                    password: '12345678',
                    passwordConfirmed: '12345678'
                });

            expect(result.success).toBeTruthy();
            expect(result.httpMethodCode).toBe(200);
        });


    });
});
