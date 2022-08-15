jest.mock('../../../app/database/models/Reference');
const { Reference } = require('../../../app/database/models/Reference');

const service = require('../../../app/services/ReferenceManagerService');

describe('Reference manager service', () => {
    const references = [
        {
            id: '1',
            title: 'test title 1',
            text: 'text 1',
            priorityOrder: 1,
            isEnabled: true,
            lastModifiedDateTime: Date.now(),
            parentId: '5c3c5dd7f8248e0cd31f0508',
            lastModifierUserId: '5c3c5dd7f8248e0cd31f0508'
        },
        {
            id: '2',
            title: 'test title 2',
            text: 'text 2',
            priorityOrder: 1,
            isEnabled: true,
            lastModifiedDateTime: Date.now(),
            parentId: '5c3c5dd7f8248e0cd31f0508',
            lastModifierUserId: '5c3c5dd7f8248e0cd31f0508'
        },
        {
            id: '3',
            title: 'test title 3',
            text: 'text 3',
            priorityOrder: 1,
            isEnabled: true,
            lastModifiedDateTime: Date.now(),
            lastModifierUserId: '5c3c5dd7f8248e0cd31f0508'
        }
    ];
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('Get references (admin)', () => {
        it('should return "NO_REFERENCE_FOUND" for invalid parent id.', async () => {
            Reference.find = jest.fn().mockReturnValueOnce(null);

            const result = await service.getReferencesAdmin('id');

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(404);
            expect(result.messages[0].message).toBe('NO_REFERENCE_FOUND');
        });

        it('should return reference list.', async () => {
            Reference.find = jest.fn().mockReturnValueOnce(references);
            const result = await service.getReferencesAdmin('id');

            expect(result.success).toBeTruthy();
            expect(result.httpMethodCode).toBe(200);
            expect(result.messages[0].message).toBe('FOUND_REFERENCES');
            expect(result.result[0]).toHaveProperty('id', '1');
        });

        it('should return "INTERNAL_ERROR" when errors occures.', async () => {
            Reference.find = jest.fn().mockImplementationOnce(() => {
                throw new Error();
            });
            const result = await service.getReferencesAdmin('id');

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(500);
            expect(result.messages[0].message).toBe('INTERNAL_ERROR');
        });
    });

    describe('Add new reference (admin)', () => {
        let model;
        beforeEach(() => {
            model = {
                title: 'test title 1',
                text: 'test text 1',
                priorityOrder: 1,
                isEnabled: true,
                lastModifiedDateTime: Date.now(),
                lastModifierUserId: '5c3c5dd7f8248e0cd31f0508'
            };
        });

        it('should return "WRONG_PARENTID" for wrong parent id', async () => {
            Reference.findById = jest.fn().mockReturnValueOnce(null);
            model.parentId = 'id';
            const result = await service.addReferenceAdmin(model);

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(422);
            expect(result.messages[0].message).toBe('WRONG_PARENT_ID');
        });

        it('should add new reference to list with no parent id', async () => {
            Reference.mockImplementationOnce(() => {});
            delete model.parentId;
            const result = await service.addReferenceAdmin(model);

            expect(result.success).toBeTruthy();
            expect(result.httpMethodCode).toBe(201);
            expect(result.messages[0].message).toBe('REFERENCE_CREATED');
        });

        it('should add new reference to list with valid parent id', async () => {
            model.parentId = 'id';
            Reference.mockImplementationOnce(() => {});
            Reference.findById = jest.fn().mockReturnValueOnce({});

            const result = await service.addReferenceAdmin(model);

            expect(result.success).toBeTruthy();
            expect(result.httpMethodCode).toBe(201);
            expect(result.messages[0].message).toBe('REFERENCE_CREATED');
        });

        it('should return "INTERNAL_ERROR" when errors occures.', async () => {
            Reference.mockImplementationOnce(() => {
                throw new Error();
            });
            const result = await service.addReferenceAdmin();

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(500);
            expect(result.messages[0].message).toBe('INTERNAL_ERROR');
        });
    });

    describe('Find reference by id (admin)', () => {
        it('should return the exact reference', async () => {
            Reference.findById = jest.fn().mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockReturnValue(references[0])
                })
            });
            const result = await service.findReferenceByIdAdmin('id');

            expect(result.success).toBeTruthy();
            expect(result.httpMethodCode).toBe(200);
            expect(result.messages[0].message).toBe('REFERENCE_FOUND');
        });

        it('should return "REFERENCE_NOT_FOUND" for wrong reference id.', async () => {
            Reference.findById = jest.fn().mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockReturnValue(null)
                })
            });
            const result = await service.findReferenceByIdAdmin('id');

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(404);
            expect(result.messages[0].message).toBe('REFERENCE_NOT_FOUND');
        });

        it('should return "INTERNAL_ERROR" when errors occures.', async () => {
            Reference.findById = jest.fn().mockImplementationOnce(() => {
                throw new Error();
            });
            const result = await service.findReferenceByIdAdmin('id');

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(500);
            expect(result.messages[0].message).toBe('INTERNAL_ERROR');
        });
    });

    describe('Update reference by id (admin)', () => {
        let model;
        beforeEach(() => {
            model = {
                id: '2',
                title: 'test title 1',
                text: 'text 1',
                priorityOrder: 1,
                isEnabled: true,
                lastModifiedDateTime: Date.now(),
                lastModifierUserId: '5c3c5dd7f8248e0cd31f0508'
            };
        });

        it('should return "WRONG_PARENTID" for wrong parent id.', async () => {
            Reference.findById = jest.fn().mockReturnValueOnce(null);
            model.parentId = 'id';
            const result = await service.updateReferenceByIdAdmin(model);

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(422);
            expect(result.messages[0].message).toBe('WRONG_PARENT_ID');
        });

        it('should update reference with no parent id.', async () => {
            Reference.findByIdAndUpdate = jest.fn().mockReturnValueOnce({});
            const result = await service.updateReferenceByIdAdmin(model);

            expect(result.success).toBeTruthy();
            expect(result.httpMethodCode).toBe(200);
            expect(result.messages[0].message).toBe('UPDATED_REFERENCE');
        });

        it('should update reference with valid parent id.', async () => {
            Reference.findByIdAndUpdate = jest.fn().mockReturnValueOnce({});
            Reference.findById = jest.fn().mockReturnValueOnce({});
            model.parentId = 'id';
            const result = await service.updateReferenceByIdAdmin(model);

            expect(result.success).toBeTruthy();
            expect(result.httpMethodCode).toBe(200);
            expect(result.messages[0].message).toBe('UPDATED_REFERENCE');
        });

        it('should return "REFERENCE_NOT_FOUND" for invalid reference id.', async () => {
            Reference.findById = jest.fn().mockReturnValueOnce(null);
            const result = await service.updateReferenceByIdAdmin(model);

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(404);
            expect(result.messages[0].message).toBe('REFERENCE_NOT_FOUND');
        });

        it('should return "INTERNAL_ERROR" when error occures.', async () => {
            Reference.findByIdAndUpdate = jest
                .fn()
                .mockImplementationOnce(() => {
                    throw new Error();
                });
            const result = await service.updateReferenceByIdAdmin(model);

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(500);
            expect(result.messages[0].message).toBe('INTERNAL_ERROR');
        });
    });

    describe('Delete reference by id', () => {
        it('should delete reference with valid id.', async () => {
            Reference.findById = jest.fn().mockReturnValueOnce({});
            Reference.findByIdAndDelete = jest.fn().mockReturnValueOnce({});
            const result = await service.deleteReferenceByIdAdmin('id');

            expect(result.success).toBeTruthy();
            expect(result.httpMethodCode).toBe(200);
            expect(result.messages[0].message).toBe('DELETED');
        });

        it('should return "REFERENCE_NOT_FOUND" for providing invalid reference id.', async () => {
            Reference.findById = jest.fn().mockReturnValueOnce(null);
            const result = await service.deleteReferenceByIdAdmin('id');

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(404);
            expect(result.messages[0].message).toBe('REFERENCE_NOT_FOUND');
        });

        it('should return "INTERNAL_ERROR" when error occures.', async () => {
            Reference.findById = jest
                .fn()
                .mockReturnValueOnce(Promise.reject());
            const result = await service.deleteReferenceByIdAdmin('id');

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(500);
            expect(result.messages[0].message).toBe('INTERNAL_ERROR');
        });
    });

    describe('Get references (guest)', () => {
        it('should return "NO_REFERENCE_FOUND" for invalid parent id.', async () => {
            Reference.find = jest.fn().mockReturnValueOnce(Promise.resolve([]));

            const result = await service.getReferencesGuest('id');

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(404);
            expect(result.messages[0].message).toBe('NO_REFERENCE_FOUND');
        });

        it('should return reference list.', async () => {
            Reference.find = jest.fn().mockReturnValueOnce(references);
            const result = await service.getReferencesGuest('id');

            expect(result.success).toBeTruthy();
            expect(result.httpMethodCode).toBe(200);
            expect(result.messages[0].message).toBe('FOUND_REFERENCES');
            expect(result.result[0]).toHaveProperty('id', '1');
            expect(result.result[0]).not.toHaveProperty('isEnabled');
        });

        it('should return "INTERNAL_ERROR" when errors occures.', async () => {
            Reference.find = jest.fn().mockImplementationOnce(() => {
                throw new Error();
            });
            const result = await service.getReferencesGuest('id');

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(500);
            expect(result.messages[0].message).toBe('INTERNAL_ERROR');
        });
    });

    describe('Find reference by id (guest)', () => {
        it('should return the exact reference with paretn.', async () => {
            Reference.findById = jest.fn().mockReturnValueOnce({
                populate: jest.fn().mockReturnValue(references[0])
            });
            const result = await service.findReferenceByIdGuest('id');

            expect(result.success).toBeTruthy();
            expect(result.httpMethodCode).toBe(200);
            expect(result.messages[0].message).toBe('REFERENCE_FOUND');
        });

        it('should return the exact reference without parent.', async () => {
            Reference.findById = jest.fn().mockReturnValueOnce({
                populate: jest.fn().mockReturnValue(references[2])
            });
            const result = await service.findReferenceByIdGuest('id');

            expect(result.success).toBeTruthy();
            expect(result.httpMethodCode).toBe(200);
            expect(result.messages[0].message).toBe('REFERENCE_FOUND');
        });

        it('should return "REFERENCE_NOT_FOUND" for wrong reference id.', async () => {
            Reference.findById = jest.fn().mockReturnValueOnce({
                populate: jest.fn().mockReturnValue(null)
            });
            const result = await service.findReferenceByIdGuest('id');

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(404);
            expect(result.messages[0].message).toBe('REFERENCE_NOT_FOUND');
        });

        it('should return "INTERNAL_ERROR" when errors occures.', async () => {
            Reference.findById = jest.fn().mockImplementationOnce(() => {
                throw new Error();
            });
            const result = await service.findReferenceByIdGuest('id');

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(500);
            expect(result.messages[0].message).toBe('INTERNAL_ERROR');
        });
    });
});
