class ResponseMessage {
    constructor({ eventId, messageId, message, type }) {
        this.eventId = eventId;
        this.messageId = messageId;
        this.message = message;
        this.type = type;
    }
}

module.exports = ResponseMessage;
