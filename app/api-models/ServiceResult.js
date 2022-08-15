const ResponseResult = require('./ResponseResult');

class ServiceResult extends ResponseResult {
    constructor({
        success,
        result,
        totalCount,
        cursor,
        exception,
        messages,
        httpMethodCode
    }) {
        super({ success, result, totalCount, cursor, exception, messages });
        this.httpMethodCode = httpMethodCode;
    }
}

module.exports = ServiceResult;
