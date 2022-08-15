jest.mock('../../../app/database/models/User');

const UserModel = require('../../../app/database/models/User');

const UserManager = require('../../../app/services/UserManagerService');

describe('addUser', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('new User success', async () => {
        const fakeUserModel = {
            firstName: 'Carny',
            lastName: 'Veart',
            username: 'cvearti',
            email: 'cvearti@accuweather.com',
            phoneNumber: '3377055294',
            imageName: 'magna.tiff',
            password: 'passydhAaz9YX',
            passwordConfirmed: 'passydhAaz9YX'
        };

        const fakeUserDoc = {
            _id: '5c81ff121eca533e04477161',
            id: '5c81ff121eca533e04477161',
            loginAttempts: 0,
            loginHistory: [],
            isEnabled: true,
            isTwoStepAuthenticationEnabled: false,
            isLockedOut: false,
            isEmailConfirmed: false,
            isPhoneNumberConfirmed: false,
            firstName: 'Carny',
            lastName: 'Veart',
            username: 'cvearti',
            email: 'cvearti@accuweather.com',
            phoneNumber: '3377055294',
            imageName: 'magna.tiff',
            creationDate: '2019-03-08T05:35:14.735Z',
            salt: 'ee036271a3b3e3ae8223eeac6a0f5479',
            hashIterations: 9825,
            passwordHash:
                'ebdfd3ff34552b7a388e504174e238c463133fd8a8014feb907fbb0659d677fe646ca09d6e31ef1a9eef28a1049516f8ff71e587efe17acb6cae296ba379d81a686623bc6fe2c9c50314c8a29d3769ac294bfa3c529aaa651f2bfff072e457dd22b15988f04d2fbbdc4edb9edb72bb1000ae03e3f829601a5ffd7577522ec5feaeb5da7e79cfa147f09e95e99e40e318a9f5d0ed4ee75bfcb79e8b0467d1c3537a1ed1a9740eae3aa6ada203b41f63052e609de58052a77d3d306934aee8a3c65f72bf12e79c59129f7474980db7cbbd7024cf127624570caf007040606532f7a276713cf88fb3872e21b768fa9d60695814d66ee8d311dd9744bf1e53f5640a77673bc8bfd7000251f67fe3561c73452e6ce278596c6ebd03f93509bf619f987c591a2dfc7f14722b31acb5691eb49affe0e4ed0b520183f185cefa8b27c26ca34c26c63b99ba8d3700bbaed485d14f6dddeb8210d78727cc2248443da4ecb0c0648dee965f0fc18a65b66d6b6354a8493b7f45ffc43f09b36a1b940aeb07608af836d673d1d898afd42d874f12252068a2a7d31952f0f808a51d168ba3bca4a3e4975eccfb89291d9559f79f8dbfc464ea72303ee5468c4ccd637462226c94b612bd82bcf1f44a16b9c9b7ede354a6734d505393109ed8494dd0be0fb36193c1e1e9563a10ee92a055ff285640fa5f83bee7d8849991c43705203cd604f5db',
            __v: 0
        };

        UserModel.mockReturnValueOnce({
            save() {
                return Promise.resolve(fakeUserDoc);
            },
            setPassword: jest.requireActual('../../../app/database/models/User')
                .prototype.setPassword
        });

        const serviceResult = await UserManager.addUser(fakeUserModel);
        expect(serviceResult.success).toBe(true);
    });

    test('new User failed because wrong passwrodConfirmed', async () => {
        const fakeUserModel = {
            firstName: 'Willey',
            lastName: 'Czapla',
            username: 'wczapla6',
            email: 'wczapla6@mayoclinic.com',
            phoneNumber: '9277720488',
            password: 'passXBqgHYYo',
            passwordConfirmed: 'passXBqgHxxo'
        };

        UserModel.mockImplementationOnce(() => {
            return {
                setPassword: jest.requireActual(
                    '../../../app/database/models/User'
                ).prototype.setPassword
            };
        });

        const serviceResult = await UserManager.addUser(fakeUserModel);
        expect(serviceResult.success).toBe(false);
        expect(serviceResult.messages[0].message).toBe(
            'NOT_IDENTICAL_PASSWORDS'
        );
    });

    test('Some problem in data layer e.g. validation, connection, ...', async () => {
        const fakeUserModel = {
            firstName: 'Constancy',
            lastName: 'Beaushaw',
            username: 'cbeaushawh',
            email: 'cbeaushawhtime.com',
            phoneNumber: '5761187854',
            imageName: 'rhoncus dui vel.tiff',
            password: 'passLydJiIsDGE',
            passwordConfirmed: 'passLydJiIsDGE'
        };

        UserModel.mockImplementationOnce(() => {
            return {
                save() {
                    return Promise.reject(new Error('oopsy'));
                },
                setPassword: jest.requireActual(
                    '../../../app/database/models/User'
                ).prototype.setPassword
            };
        });

        const serviceResult = await UserManager.addUser(fakeUserModel);
        expect(serviceResult.success).toBe(false);
        expect(serviceResult.messages[0].message).toEqual('BAD_REQUEST');
    });
});

describe('updateUserById', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('Successfully updating a user', async () => {
        const fakeUserModel = {
            id: '5c81ff121eca533e04477161',
            firstName: 'Kushim'
        };

        const fakeUserDoc = {
            _id: '5c81ff121eca533e04477161',
            id: '5c81ff121eca533e04477161',
            loginAttempts: 0,
            loginHistory: [],
            isEnabled: true,
            isTwoStepAuthenticationEnabled: false,
            isLockedOut: false,
            isEmailConfirmed: false,
            isPhoneNumberConfirmed: false,
            firstName: 'Kushim',
            lastName: 'Veart',
            username: 'cvearti',
            email: 'cvearti@accuweather.com',
            phoneNumber: '3377055294',
            imageName: 'magna.tiff',
            creationDate: '2019-03-08T05:35:14.735Z',
            salt: 'ee036271a3b3e3ae8223eeac6a0f5479',
            hashIterations: 9825,
            passwordHash:
                'ebdfd3ff34552b7a388e504174e238c463133fd8a8014feb907fbb0659d677fe646ca09d6e31ef1a9eef28a1049516f8ff71e587efe17acb6cae296ba379d81a686623bc6fe2c9c50314c8a29d3769ac294bfa3c529aaa651f2bfff072e457dd22b15988f04d2fbbdc4edb9edb72bb1000ae03e3f829601a5ffd7577522ec5feaeb5da7e79cfa147f09e95e99e40e318a9f5d0ed4ee75bfcb79e8b0467d1c3537a1ed1a9740eae3aa6ada203b41f63052e609de58052a77d3d306934aee8a3c65f72bf12e79c59129f7474980db7cbbd7024cf127624570caf007040606532f7a276713cf88fb3872e21b768fa9d60695814d66ee8d311dd9744bf1e53f5640a77673bc8bfd7000251f67fe3561c73452e6ce278596c6ebd03f93509bf619f987c591a2dfc7f14722b31acb5691eb49affe0e4ed0b520183f185cefa8b27c26ca34c26c63b99ba8d3700bbaed485d14f6dddeb8210d78727cc2248443da4ecb0c0648dee965f0fc18a65b66d6b6354a8493b7f45ffc43f09b36a1b940aeb07608af836d673d1d898afd42d874f12252068a2a7d31952f0f808a51d168ba3bca4a3e4975eccfb89291d9559f79f8dbfc464ea72303ee5468c4ccd637462226c94b612bd82bcf1f44a16b9c9b7ede354a6734d505393109ed8494dd0be0fb36193c1e1e9563a10ee92a055ff285640fa5f83bee7d8849991c43705203cd604f5db',
            __v: 0
        };

        UserModel.findByIdAndUpdate.mockReturnValueOnce({
            lean() {
                return Promise.resolve(fakeUserDoc);
            }
        });

        const serviceResult = await UserManager.updateUserById(fakeUserModel);
        expect(serviceResult.success).toBe(true);
    });

    test('Updating a non-existing user', async () => {
        const fakeUserModel = {
            id: '5c81ff121eca533e04477221',
            firstName: 'hahaha'
        };

        UserModel.findByIdAndUpdate.mockReturnValueOnce({
            lean() {
                return Promise.resolve(null);
            }
        });
        const serviceResult = await UserManager.updateUserById(fakeUserModel);
        expect(serviceResult.success).toBe(false);
        expect(serviceResult.messages[0].message).toBe('WRONG_USERID');
    });

    test('Handles errors thrown by data layer (mongoose) properly', async () => {
        const fakeUserModel = {
            id: '5c81ff121eca533e04477450',
            email: 'oops@oops.com'
        };
        UserModel.findByIdAndUpdate.mockImplementationOnce(() => {
            return Promise.reject('Some error!');
        });
        const serviceResult = await UserManager.updateUserById(fakeUserModel);
        expect(serviceResult.success).toBe(false);
        expect(serviceResult.messages[0].message).toBe('BAD_REQUEST');
    });
});

describe('getUserById', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('should return the correct user successfully', async () => {
        const fakeUserDoc = {
            _id: '5c81ff121eca533e04477161',
            loginAttempts: 0,
            loginHistory: [],
            isEnabled: true,
            isTwoStepAuthenticationEnabled: false,
            isLockedOut: false,
            isEmailConfirmed: false,
            isPhoneNumberConfirmed: false,
            firstName: 'Carny',
            lastName: 'Veart',
            username: 'cvearti',
            email: 'cvearti@accuweather.com',
            phoneNumber: '3377055294',
            imageName: 'magna.tiff',
            creationDate: '2019-03-08T05:35:14.735Z',
            salt: 'ee036271a3b3e3ae8223eeac6a0f5479',
            hashIterations: 9825,
            passwordHash:
                'ebdfd3ff34552b7a388e504174e238c463133fd8a8014feb907fbb0659d677fe646ca09d6e31ef1a9eef28a1049516f8ff71e587efe17acb6cae296ba379d81a686623bc6fe2c9c50314c8a29d3769ac294bfa3c529aaa651f2bfff072e457dd22b15988f04d2fbbdc4edb9edb72bb1000ae03e3f829601a5ffd7577522ec5feaeb5da7e79cfa147f09e95e99e40e318a9f5d0ed4ee75bfcb79e8b0467d1c3537a1ed1a9740eae3aa6ada203b41f63052e609de58052a77d3d306934aee8a3c65f72bf12e79c59129f7474980db7cbbd7024cf127624570caf007040606532f7a276713cf88fb3872e21b768fa9d60695814d66ee8d311dd9744bf1e53f5640a77673bc8bfd7000251f67fe3561c73452e6ce278596c6ebd03f93509bf619f987c591a2dfc7f14722b31acb5691eb49affe0e4ed0b520183f185cefa8b27c26ca34c26c63b99ba8d3700bbaed485d14f6dddeb8210d78727cc2248443da4ecb0c0648dee965f0fc18a65b66d6b6354a8493b7f45ffc43f09b36a1b940aeb07608af836d673d1d898afd42d874f12252068a2a7d31952f0f808a51d168ba3bca4a3e4975eccfb89291d9559f79f8dbfc464ea72303ee5468c4ccd637462226c94b612bd82bcf1f44a16b9c9b7ede354a6734d505393109ed8494dd0be0fb36193c1e1e9563a10ee92a055ff285640fa5f83bee7d8849991c43705203cd604f5db',
            __v: 0
        };

        const fakeUserId = fakeUserDoc._id;

        UserModel.findByIdWithCache = jest
            .fn()
            .mockReturnValueOnce(fakeUserDoc);

        const serviceResult = await UserManager.getUserById(fakeUserId);
        expect(serviceResult.success).toBe(true);
        expect(serviceResult.result.id).toBe('5c81ff121eca533e04477161');
        expect(serviceResult.result.email).toBe('cvearti@accuweather.com');
        expect(serviceResult.messages[0].message).toBe('USER_FOUND');
    });

    test('should return nothing on non-existing user id', async () => {
        const fakeUserId = '5c81ff121ecf733e0447715f';
        UserModel.findByIdWithCache = jest.fn().mockReturnValueOnce(null);
        const serviceResult = await UserManager.getUserById(fakeUserId);
        expect(serviceResult.success).toBe(false);
        expect(serviceResult.messages[0].message).toBe('NOT_FOUND');
    });

    test('should handle errors thrown by data layer properly', async () => {
        const fakeUserId = '7d81ff121ecf733e0447715f';
        UserModel.findById.mockImplementationOnce(() => {
            return Promise.reject('Some error!');
        });
        UserModel.findByIdWithCache = UserModel.findById;

        const serviceResult = await UserManager.getUserById(fakeUserId);
        expect(serviceResult.success).toBe(false);
        expect(serviceResult.messages[0].message).toBe('SERVER_ERROR');
    });
});

describe('getUsers', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('should return list of users', async () => {
        const fakeUsers = [
            {
                _id: '5c81ff121eca533e0447715c',
                id: '5c81ff121eca533e0447715c',
                loginAttempts: 0,
                loginHistory: [],
                isEnabled: true,
                isTwoStepAuthenticationEnabled: false,
                isLockedOut: false,
                isEmailConfirmed: false,
                isPhoneNumberConfirmed: false,
                firstName: 'Lynn',
                lastName: 'Boyan',
                username: 'lboyand',
                email: 'lboyand@printfriendly.com',
                phoneNumber: '3837016279',
                imageName: 'maecenas tristique est.gif',
                creationDate: '2019-03-08T05:35:14.373Z',
                salt: '6f4d49a831cf44f64abde5f860e7b5a1',
                hashIterations: 11064,
                passwordHash:
                    '64f00d74fae327f353e0d6d686ae4cefd3a9c8ceceb9edda2f699da9cce066cf91be5e79f0ee9aba05904b511fd838aca92c100191a81ab2ce4a6491c71e0b4250db4bad77ae418ca046f0e8cddf93dd3926965fd2783567769bbbe84045838ddb6a71ba7871c8750a7a73c28a538de671abd8430d0c51a53560e9a2abc39e729abd0268f6dd7a84c729247e135011e2171b601ce4a745e2973d2fe0be709156e158241c2ebc62ee5d0d3949d4a83086c80afed50a499278677e8b3ff5c9f32383a4da1df8ef8c72a3793601bf85580754a2782879e2d44df90b1f3b51fbce0bc299b4c156c52a1bb11e75cee664e4499679371859e0e758f0f0edab83890b3b09876f24343febd4f0a30f6d8ae0cdfd23bbeadd402b556b4e746940a24d68dc89e099a2c223a46099f94998241974cac6c712d82bfc9d33cdcf481df531af5415a10748c5c23f5f1d71bf16bc645a156c0836a2047d75211af479e4ec1a9026ddd312ff7ea234473a79da20fb46c58a848810f4329aeb83ee4a714872ae2635094f53c77b8b48248aa3a591c0f98d8c918331479b3de515754a62cab150b5b414ad1f3c9890d519832a6946fcc3b5e5c3492d5d91dc93983cd2a3156821b735eda922293c2015a7852b041e1918867e5b2c18d12edd4ead404a5646628d22d3990d6fefee662d948c3746c52ef109333578b3db2e36f925c5aa5cbb0ff649a7',
                __v: 0
            },
            {
                _id: '5c81ff121eca533e0447715f',
                id: '5c81ff121eca533e0447715f',
                loginAttempts: 0,
                loginHistory: [],
                isEnabled: true,
                isTwoStepAuthenticationEnabled: false,
                isLockedOut: false,
                isEmailConfirmed: false,
                isPhoneNumberConfirmed: false,
                firstName: 'Katrinka',
                lastName: 'Senner',
                username: 'ksennerg',
                email: 'ksennerg@nature.com',
                phoneNumber: '4311534921',
                imageName: 'sollicitudin vitae.gif',
                creationDate: '2019-03-08T05:35:14.596Z',
                salt: 'f6fe64283947af1819c0684d5d0f2200',
                hashIterations: 10672,
                passwordHash:
                    '9b56e344a9c7928798f9dc285af6e775bbd48ddff73768da465574c1fb8f967611c70a9252b82d786e623389a545031d73b8f39a4f4b40069577785d5d5d8448e8805d9d5210f21fc185ca4319fc43ecfaf12dd48148ebe807ff39871d15cfbeef29853106c6877548ba7a0b0feb264133655e4b32285f9ac2193f245404d036eb7abad6646c9b2dfb02745e30f4763adc9b05b621963e73926866a2b2f25043d5e28a095be6d81a694e444526e7ef40b1d41823cb381717c14908662ec8dc0729f937a16b6d250586fad05d49a74f2bf946734d327cf96af5a7c2feb0a3b55f397f0a5ef87a952b44f58dbe6db9d195428ddb0bcdbf5db676d83b9fa647e7f6e7557e33db5f946dfd5ec7187293034782ce4977d344a9149a0cee31c9454a2157cc75a8f93dd7f606be247c50248b789ab8ba5772d78d9b562c461b840e382f5e949fb7d23607db561f0d8b08b1bba04152ce70dc5d12d03581a9fb9d4c926d745d0b14efa0a68b20f29100b5cc052b41e9342e74f6dbea907b49fa715a629b3cbb05d7151ce0c0b5351aa45c3a37ca115d77bbcc3bb59766fed7f3b3c4e7a9cfa4f8ec70e1b4c2fcece5609e29997162b172a885498fc3c8aa400de4ab93cc58136c69be22c6c1c8ec2cd0a95dba813932c85aa3b617bc3de62c45729b34b0e0d466102e3b3b5c25f639bc287a066c608d63fd7551452a8675efd9b1200956',
                __v: 0
            },
            {
                _id: '5c81ff121eca533e04477160',
                id: '5c81ff121eca533e04477160',
                loginAttempts: 0,
                loginHistory: [],
                isEnabled: true,
                isTwoStepAuthenticationEnabled: false,
                isLockedOut: false,
                isEmailConfirmed: false,
                isPhoneNumberConfirmed: false,
                firstName: 'Constancy',
                lastName: 'Beaushaw',
                username: 'cbeaushawh',
                email: 'cbeaushawh@time.com',
                phoneNumber: '5761187854',
                imageName: 'rhoncus dui vel.tiff',
                creationDate: '2019-03-08T05:35:14.668Z',
                salt: '0fe4c9f3944de1acf7d8f4c5e0b0386a',
                hashIterations: 9992,
                passwordHash:
                    '59f9943e4d5edfa88aa75bb715268142201fe3198cd2e930b05a6a71b712dd3f6d4ee7b7f34a5889da6b7bccd17a1a3c4baaae235ab91680aa8318901847418327e04340d87cda7edaa7d5ec7a90bc8e372bc2464b605698d8796b94809d925ab580795d3f4231e698308b7c5b63072885852eaf1d7aad7b5bf1032e3c00a01b701168045ca20a0929305137679ad6f50b99938bddc7e528ac8f071f1f81319c2aba4ed47ba25e3c60163c15300861fc6233ae27e91cd2b383fb49587f495546af5b9a65c880d8dc7ccbbd0b4fd27f2df1aa41a6c0e3df60b1a24d62274040225269bc1f2ea633288ccba4183aaf96d21419c7356798250ab6763b46729700a8c23f586c3a638adb692abad953f8040a56f7022c5c159374e08828571d955341967d3e8c03a7a7b707a77e5eaa42c54290e2c925ae741a4eeb92bae79932688633786f54434ce838a26c578393a1c83e8c728dd7735719a07d60bb060b1ece9598e4c637907595d0d3186649b0f8c1dcc615c0f9d417435a946db697a27beadaf4d79364e2c2d48dd8e0955c8ef73bfd6ce818c8908943d674a8fef8b7e20a983c58d9a91d90bb079b1220f26ea7d616b9ec355d951dba1432f52c85ec4e16c92a0d8a286337363b7c068dc06a40fa237de347904104bf9156d4aa586787f6be3cc5128ad010b1638d7621eb446db12c7ad841d99cfc6bb346693a46c29c3f82',
                __v: 0
            }
        ];

        UserModel.find.mockImplementationOnce(() => ({
            skip() {
                return {
                    limit: this.limit,
                    lean: this.lean
                };
            },
            limit() {
                return {
                    lean: this.lean,
                    skip: this.skip
                };
            },
            lean() {
                return Promise.resolve(fakeUsers);
            }
        }));

        const serviceResult = await UserManager.getUsers({
            limit: 0,
            offset: 0
        });

        expect(serviceResult.result[2]).username = 'cbeaushawh';
        expect(serviceResult.success).toBe(true);
    });

    test('should handle errors thrown by data layer properly', async () => {
        UserModel.find.mockReturnValueOnce(
            Promise.reject(new Error('some error'))
        );
        const serviceResult = await UserManager.getUsers({
            limit: 0,
            offset: 0
        });
        expect(serviceResult.success).toBe(false);
        expect(serviceResult.messages[0].message).toBe('SERVER_ERROR');
    });
});

describe('delUserById', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('should handle deleting properly', async () => {
        const fakeUserDoc = {
            _id: '5c81ff121eca533e04477161',
            loginAttempts: 0,
            loginHistory: [],
            isEnabled: true,
            isTwoStepAuthenticationEnabled: false,
            isLockedOut: false,
            isEmailConfirmed: false,
            isPhoneNumberConfirmed: false,
            firstName: 'Carny',
            lastName: 'Veart',
            username: 'cvearti',
            email: 'cvearti@accuweather.com',
            phoneNumber: '3377055294',
            imageName: 'magna.tiff',
            creationDate: '2019-03-08T05:35:14.735Z',
            salt: 'ee036271a3b3e3ae8223eeac6a0f5479',
            hashIterations: 9825,
            passwordHash:
                'ebdfd3ff34552b7a388e504174e238c463133fd8a8014feb907fbb0659d677fe646ca09d6e31ef1a9eef28a1049516f8ff71e587efe17acb6cae296ba379d81a686623bc6fe2c9c50314c8a29d3769ac294bfa3c529aaa651f2bfff072e457dd22b15988f04d2fbbdc4edb9edb72bb1000ae03e3f829601a5ffd7577522ec5feaeb5da7e79cfa147f09e95e99e40e318a9f5d0ed4ee75bfcb79e8b0467d1c3537a1ed1a9740eae3aa6ada203b41f63052e609de58052a77d3d306934aee8a3c65f72bf12e79c59129f7474980db7cbbd7024cf127624570caf007040606532f7a276713cf88fb3872e21b768fa9d60695814d66ee8d311dd9744bf1e53f5640a77673bc8bfd7000251f67fe3561c73452e6ce278596c6ebd03f93509bf619f987c591a2dfc7f14722b31acb5691eb49affe0e4ed0b520183f185cefa8b27c26ca34c26c63b99ba8d3700bbaed485d14f6dddeb8210d78727cc2248443da4ecb0c0648dee965f0fc18a65b66d6b6354a8493b7f45ffc43f09b36a1b940aeb07608af836d673d1d898afd42d874f12252068a2a7d31952f0f808a51d168ba3bca4a3e4975eccfb89291d9559f79f8dbfc464ea72303ee5468c4ccd637462226c94b612bd82bcf1f44a16b9c9b7ede354a6734d505393109ed8494dd0be0fb36193c1e1e9563a10ee92a055ff285640fa5f83bee7d8849991c43705203cd604f5db',
            __v: 0
        };

        const fakeUserId = '8e81ff121eca533e0447719d';
        UserModel.findByIdAndDelete.mockReturnValueOnce(
            Promise.resolve(fakeUserDoc)
        );

        const serviceResult = await UserManager.delUserById(fakeUserId);
        expect(serviceResult.success).toBe(true);
        expect(serviceResult.messages[0].message).toBe('USER_DELETED');
    });

    test('should return false on non-existing user', async () => {
        const fakeUserId = '8e81ff121eca533e0447719d';
        UserModel.findByIdAndDelete.mockReturnValueOnce(Promise.resolve(null));
        const serviceResult = await UserManager.delUserById(fakeUserId);
        expect(serviceResult.success).toBe(false);
        expect(serviceResult.messages[0].message).toBe('USER_NOT_FOUND');
    });

    test('should handle errors thrown by data layer properly', async () => {
        const fakeUserId = '8e81ff121eca533e0447719d';
        UserModel.findByIdAndDelete.mockReturnValueOnce(
            Promise.reject(new Error('yep! another error'))
        );
        const serviceResult = await UserManager.delUserById(fakeUserId);
        expect(serviceResult.success).toBe(false);
        expect(serviceResult.messages[0].message).toBe('SERVER_ERROR');
    });
});
