const HomeManagerService = require(
    '../../../app/services/HomeManagerService');
const logger = require('../../../app/providers/logger-factory')('test');

describe('Home manager service', () => {
    let homeManagerService;
    let list = [];
    beforeEach(() => {
        list = [{
            id: 'id',
            title: 'Title of Website',
            text: 'text text text'
        }];

        let elasticsearch = {
            searchInElastic: function (keyword) {
                if (keyword == 'THIS_IS_EXCEPTION')
                    throw new Error(
                        'This is exception test');
                else
                    return list;
            }
        };

        homeManagerService = new HomeManagerService(
            elasticsearch, logger);
    });

    describe('Search by keyword using elasticsearch', () => {
        it('should return a list of data as search result',
            async () => {
                const result = await homeManagerService
                    .search('something');

                expect(result.success).toBeTruthy();
                expect(result.httpMethodCode).toBe(200);
            });

        it('should give 404 code message',
            async () => {
                list = [];
                const result = await homeManagerService
                    .search('something');

                expect(result.success).toBeFalsy();
                expect(result.httpMethodCode).toBe(404);
            });

            it('should throw exception and give 422 code message',
            async () => {
                list = [];
                const result = await homeManagerService
                    .search('THIS_IS_EXCEPTION');

                expect(result.success).toBeFalsy();
                expect(result.httpMethodCode).toBe(422);
            });
    });
});
