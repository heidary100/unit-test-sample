const SubjectManager = require('../../../app/services/SubjectManagerService.js');
const logger = require('../../../app/providers/logger-factory')('test');

describe('Subject manager service', () => {
    let subjectManager;
    beforeEach(() => {
        const list = [
            {
                _id: '1',
                title: 'title 1',
                priorityOrder: 1,
                isEnabled: true
            },
            {
                _id: '2',
                title: 'title 2',
                priorityOrder: 1,
                isEnabled: true
            },
            {
                _id: '3',
                title: 'title 3',
                priorityOrder: 1,
                isEnabled: true
            }
        ];
        class Subject {

            constructor(model) {
                list.push(model);
            }

            save() {
                return list;
            }

            static find(id) {
                return this;
            }

            static skip() {
                return this;
            }
            
            static limit(l) {
                if(typeof(l) != 'number')
                    throw new Error('Invalid type');
                return list;
            }
            
            static findById(id) {
                if(typeof(id) == 'number') throw new Error('Wrong type.');
                const result = list.find(ref => ref._id == id);
                return result;
            }

            static findByIdWithCache(id) {
                const result = list.find(ref => ref._id == id);
                return result;
            }

            static findOne({ _id }) {
                const result = list.find(ref => ref._id == _id);
                return result;
            }

            static findOne({ title }) {
                const result = list.find(ref => ref.title == title);
                return result;
            }

            static findByIdAndDelete({ _id }) {
                const result = list.find(ref => ref._id == _id);
                if(!result)
                    throw new Error('No subject found with this id');
                else
                    return new Subject();
            }

            static findByIdAndUpdate({ _id }, model) {
                const result = list.find(ref => ref._id == _id);
                if(!result)
                    throw new Error('No subject found with this id');
                else
                    return new Subject(model);
            }
        };

        subjectManager = new SubjectManager(Subject, logger);
    });

    describe('Get subjects', () => {
        it('should return subject list', async() => {
            const result = await subjectManager.getSubjects(1, 2);

            expect(result.success).toBeTruthy();
        });

        it('should return "INVALID_LIMIT_OR_OFFSET" for negetive limit or offset', async () => {
            const result = await subjectManager.getSubjects(-1, 2);

            expect(result.success).toBeFalsy();
            expect(result.messages[0].message).toBe('INVALID_LIMIT_OR_OFFSET');
        });

        it('should return subject list with limit 100.', async () => {
            const result = await subjectManager.getSubjects(1000);

            expect(result.success).toBeTruthy();
            expect(result.httpMethodCode).toBe(200);
        });

        it('should throw new error for not providing limit', async () => {
            const result = await subjectManager.getSubjects();
            expect(result.success).toBeFalsy();
            expect(result.messages[0].message).toBe('LIMIT_NOT_PROVIDED');
        });

        it('should return "BAD_REQUEST" when error occures.', async () => {
            const result = await subjectManager.getSubjects('testi');
            
            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(400);
            expect(result.messages[0].message).toBe('BAD_REQUEST');
        });
    });

    describe('Add new subject', () => {
        let model;
        beforeEach(() => {
            model = {
                title: 'title 4',
                priorityOrder: 1,
                isEnabled: true
            };
        });

        it('Should add new subject to list', async() => { 
            const result = await subjectManager.addSubject(model);

            expect(result.success).toBeTruthy();
        });

        it('Should return title exists', async() => { 
            model = {
                title: 'title 3',
                priorityOrder: 1,
                isEnabled: true
            };
            const result = await subjectManager.addSubject(model);

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(501);
        });

        it('should return "BAD_REQUEST" when errors occures.', async () => {
            const result = await subjectManager.addSubject();

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(400);
            expect(result.messages[0].message).toBe('BAD_REQUEST');
        });
    });

    describe('Find subject by id', () => {
        
        it('Should return the exact subject', async() => {
            const result = await subjectManager.findSubjectById('1');

            expect(result.success).toBeTruthy();
        });

        it('should return "BAD_REQUEST" when errors occures.', async () => {
            const result = await subjectManager.findSubjectById(9);

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(400);
            expect(result.messages[0].message).toBe('BAD_REQUEST');
        });
        it('Should return no subject', async() => {
            const result = await subjectManager.findSubjectById('9');

            expect(result.success).toBeFalsy();
            expect(result.messages[0].message).toBe('SUBJECT_NOT_FOUND');
        });
    });

    describe('Update subject by id', () => {
        let model;
        beforeEach(()=>{
            model = {
                id: '2',
                title: 'title 1',
                priorityOrder: 1,
                isEnabled: true
            };
        });

        it('should update subject with valid id', async () => {
            model.id = '1';
            const result = await subjectManager.updateSubjectById(model);

            expect(result.success).toBeTruthy();
        });

        it('should return unsuccessful state for unvalid subject id', async () => {
            model.id = '66';
            const result = await subjectManager.updateSubjectById(model);

            expect(result.success).toBeFalsy();
        });
    });
    describe('Delete subject by id', () => {
        
        it('Should delete subject with valid id', async() => {
            const result = await subjectManager.deleteSubjectById('1');

            expect(result.success).toBeTruthy();
        });    

        it('Should return unsuccessfull state with unvalid id', async() => {
            const result = await subjectManager.deleteSubjectById('9');

            expect(result.success).toBeFalsy();
        });

        it('should return "BAD_REQUEST" when error occures.', async () => {
            const result = await subjectManager.deleteSubjectById(9);
            
            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(400);
            expect(result.messages[0].message).toBe('BAD_REQUEST');
        });
    });
});
