class ReponseResult {
    constructor({ success, result, totalCount, cursor, exception, messages }) {
        this.success = success;
        this.result = result;
        this.cursor = cursor;
        this.totalCount = totalCount;
        this.exception = exception;
        this.messages = messages;
    }
}

module.exports = ReponseResult;
