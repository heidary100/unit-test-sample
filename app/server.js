const https = require('https');
const fs = require('fs');
const app = require('express')();
const logger = require('./providers/logger-factory')('startup - server');

// Configuriing configuration directory
process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';
const config = require('config');

// chantHanler should be imported after config and logger!!!
const chatHandler = require('./providers/chat-handler');

// Configuring server listener
const PORT = process.env.PORT || 3000;
const options = {
    key: fs.readFileSync(`${__dirname}/../${config.get('https.key')}`, 'utf8'),
    cert: fs.readFileSync(`${__dirname}/../${config.get('https.cert')}`, 'utf8')
};

const server = https.createServer(options, app);

// Configuring logger to project
require('./startup/logger')(server);
require('./startup/db')();
require('./startup/routes')(app);

// adding websocket capabilities
chatHandler(server);

server.listen(PORT, () => logger.info(`Express server listening on port ${PORT} ...`));
module.exports = server;
