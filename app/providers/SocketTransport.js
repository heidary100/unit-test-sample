const Transport = require('winston-transport');
const WebSocket = require('ws');

const authSocketMiddleware = require('../middlewares/auth-socket-middleware');

class SocketTransport extends Transport {
    constructor(opts) {
        super(opts);
        this.wss = new WebSocket.Server({
            server: opts.server,
            path: '/api/v1/log',
            verifyClient: (info, done) => {
                authSocketMiddleware(info, done);
            }
        });

        this.wss.broadcast = data => {
            this.wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        };
    }

    log(info, callback) {
        this.wss.broadcast(JSON.stringify(info));
        callback();
    }
}

module.exports = SocketTransport;
