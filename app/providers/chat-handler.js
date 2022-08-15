const WebSocket = require('ws');
const url = require('url');
const jwt = require('jsonwebtoken');
const config = require('config');

const loggerFactory = require('../providers/logger-factory');
const logger = loggerFactory('Provider - Chat handler');

function verifyClient({ req }) {
    const urlParts = url.parse(req.url, true);
    const { access_token: token } = urlParts.query;
    try {
        const decoded = jwt.verify(token, config.get('jwt.privateKey'));
        req.user = decoded;
    } catch (error) {
        logger.error(error);
        return false;
    }
    return true;
}

function handleChat(server) {
    const wss = new WebSocket.Server({ server, path: '/chat', verifyClient });

    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data, error => {
                    if (error) {
                        logger.error(
                            'Error while sending ws, closing client connection, Error: ',
                            error
                        );
                        client.close();
                    }
                });
            }
        });
    };

    const interval = setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false) return ws.terminate();

            ws.isAlive = false;
            ws.ping(() => {});
        });
    }, 30000);

    wss.on('close', () => clearInterval(interval));

    wss.on('connection', function connection(ws, req) {
        logger.info(`new connection - user: ${req.user}`);

        ws.isAlive = true;

        ws.on('pong', heartbeat);

        ws.on('message', function incoming(message) {
            logger.info('received: %s', message);
            const parsedMsg = JSON.parse(message);
            let resp = null;

            switch (parsedMsg.type) {
                case 'CHAT_MESSAGE':
                    resp = {
                        type: 'CHAT_MESSAGE',
                        payload: parsedMsg.payload,
                        senderId: req.user.id,
                        date: Date.now()
                    };
                    wss.broadcast(JSON.stringify(resp));
                    break;
                default:
                    logger.info('unknown type:', parsedMsg.type);
                    resp = {
                        type: 'UNSUPPORTED_MESSAGE',
                        date: Date.now()
                    };
                    ws.send(JSON.stringify(resp), error => {
                        if (error) {
                            logger.error(
                                'Error while sending ws, closing client connection, Error: ',
                                error
                            );
                            ws.close();
                        }
                    });
            }
        });

        ws.on('close', () => {
            logger.log('a socket has beent closed');
        });
    });
}

function heartbeat() {
    this.isAlive = true;
}

module.exports = exports = handleChat;
