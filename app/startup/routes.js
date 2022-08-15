const bodyParser = require('body-parser');
const subjects = require('../routes/subjects-router');
const manageSubjects = require('../routes/manage-subjects-router');
const errorMiddleware = require('../middlewares/error-handler');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const logger = require('../providers/logger-factory')('startup - routes');
const referencesRouter = require('../routes/references-router');
const manageReferencesRouter = require('../routes/manage-references-router');
const authRouter = require('../routes/auth-router');
const manageWebsiteSettingRouter = require('../routes/manage-website-setting-router');
const websiteSettingRouter = require('../routes/website-setting-router');
const forgetPassword = require('../routes/password-reset');
const manageUserSettingRouter = require('../routes/manage-user-setting-router');
const manageUsersRouter = require('../routes/manage-users-router');
const homeRouter = require('../routes/home-router');

const guidesRouter = require('../routes/guides-router');
const manageGuidesRouter = require('../routes/manage-guides-router');

const authMiddleware = require('../middlewares/auth-middleware');

module.exports = app => {
    app.use(bodyParser.json());
    app.use(
        bodyParser.urlencoded({
            extended: true
        })
    );

    app.use('/', errorMiddleware);

    // Initialing swagger
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    logger.info('Swagger is on route \'/api-docs\'');

    // Initializing routes
    app.use('/api/v1', authRouter);

    app.use('/api/v1/references', referencesRouter);
    app.use(
        '/api/v1/manage/references',
        authMiddleware(),
        manageReferencesRouter
    );

    app.use('/api/v1/manage/users', authMiddleware(), manageUsersRouter);

    app.use('/api/v1/subjects', subjects);
    app.use('/api/v1/manage/subjects', authMiddleware(), manageSubjects);

    app.use('/api/v1/guides', guidesRouter);
    app.use('/api/v1/manage/guides', authMiddleware(), manageGuidesRouter);

    app.use('/api/v1/manage/websitesetting',authMiddleware(), manageWebsiteSettingRouter);
    app.use('/api/v1/websitesetting', websiteSettingRouter);

    app.use('/api/v1', forgetPassword);

    app.use(
        '/api/v1/manage/usersetting',
        authMiddleware(),
        manageUserSettingRouter
    );

    app.use('/api/v1', homeRouter);
};
