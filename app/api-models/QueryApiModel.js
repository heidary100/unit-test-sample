class QueryApiModel {   
	constructor({query, offset, limit}) {         
		this.query = query;
		this.offset = offset;
		this.limit = limit;
	}
}

module.exports = QueryApiModel;


