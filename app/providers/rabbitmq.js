const amqp = require('amqplib/callback_api');

// Log
const loggerFactory = require('./logger-factory');
const rabbitmqLogger = loggerFactory('Rabbitmq - Queue');

function rabbitMQPublisher(q, msg) {
    amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
            ch.assertQueue(q, {durable: true});
            ch.sendToQueue(q, new Buffer(msg));
            rabbitmqLogger.info(` Data sent to queue ...`);
          });
        setTimeout(function() { conn.close(); }, 500);
    });
}

function rabbitMQ(q, work) {
    amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
            ch.assertQueue(q, {durable: true});
            ch.prefetch(1);
            // ch.consume(q, work, {noAck: false});
            rabbitmqLogger.info(` [*] Waiting for messages in ${q}`);
        });
    });
}

module.exports = {
    rabbitMQPublisher,
    rabbitMQ
};
