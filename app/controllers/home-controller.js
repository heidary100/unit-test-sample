const ResponseResult = require('../api-models/ResponseResult');
const serviceLogger = require('../providers/logger-factory')('Service - HomeManager');
const HomeManagerService = require('../services/HomeManagerService');
const elasticsearch = require('../providers/elasticsearch');

const homeManagerService = new HomeManagerService(elasticsearch, serviceLogger);

/**
 * Use this controller for providing a login with username and password.
 * @param {HttpRequest} req Request parameter from express
 * @param {HttpResponse} res Response parameter from express
 */
async function search(req, res) {
    let keyword = req.query.query;
    // TODO: validate inputs

    // Send data to service
    const result = await homeManagerService.search(keyword);

    // Presentation result
    let response = new ResponseResult(result);
    let httpMethodCode = result.httpMethodCode;

    // Sending the result
    res.status(httpMethodCode).send(response);
}

module.exports = {
    search
};
