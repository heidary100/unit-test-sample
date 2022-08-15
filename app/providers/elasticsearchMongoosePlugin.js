const {
    storeSubject,
    storeGuide,
    storeReference,
    deleteSubject,
    deleteGuide,
    deleteReference,
    logger
} = require('./elasticsearch');

module.exports = {
    subjectPlugin: async function (schema) {
        schema.post('save', async function (doc, next) {
            logger.info(`${doc} has been Saved`);
            await storeSubject(doc);
            next();
        });

        schema.post('update', async function (doc, next) {
            logger.info(`${doc} has been Updated`);
            await storeSubject(doc);
            next();
        });

        schema.post('remove', async function (doc, next) {
            logger.info(`${doc} has been Removed`);
            await deleteSubject(doc);
            next();
        });
    },
    guidePlugin: async function (schema) {
        schema.post('save', async function (doc, next) {
            logger.info(`${doc} has been Saved`);
            await storeGuide(doc);
            next();
        });

        schema.post('update', async function (doc, next) {
            logger.info(`${doc} has been Updated`);
            await storeGuide(doc);
            next();
        });

        schema.post('remove', async function (doc, next) {
            logger.info(`${doc} has been Removed`);
            await deleteGuide(doc);
            next();
        });
    },
    referencePlugin: async function (schema) {
        schema.post('save', async function (doc, next) {
            logger.info(`${doc} has been Saved`);
            await storeReference(doc);
            next();
        });

        schema.post('update', async function (doc, next) {
            logger.info(`${doc} has been Updated`);
            await storeReference(doc);
            next();
        });

        schema.post('remove', async function (doc, next) {
            logger.info(`${doc} has been Removed`);
            await deleteReference(doc);
            next();
        });
    }
};
