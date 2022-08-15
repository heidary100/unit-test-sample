class DetailReferenceAdminApiModel {
    constructor({ title, text, lastModifiedDateTime, parentId, parentTitle }) {
        this.title = title;
        this.text = text;
        this.lastModifiedDateTime = lastModifiedDateTime;
        this.parent = {
            id: parentId,
            title: parentTitle
        };
    }
}

module.exports = DetailReferenceAdminApiModel;
