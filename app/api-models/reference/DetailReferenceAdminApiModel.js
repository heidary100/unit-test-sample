class DetailReferenceAdminApiModel {
    constructor({
        title,
        text,
        priorityOrder,
        isEnabled,
        lastModifiedDateTime,
        parentId,
        parentTitle,
        userId,
        username
    }) {
        this.title = title;
        this.text = text;
        this.priorityOrder = priorityOrder;
        this.isEnabled = isEnabled;
        this.lastModifiedDateTime = lastModifiedDateTime;
        this.parent = {
            id: parentId,
            title: parentTitle
        };
        this.lastModifierUser = {
            userId: userId,
            username: username
        };
    }
}

module.exports = DetailReferenceAdminApiModel;
