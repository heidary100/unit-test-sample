class AddReferenceAdminApiModel {
    constructor({
        id,
        title,
        text,
        priorityOrder,
        isEnabled,
        parentId,
        lastModifierUserId
    }) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.priorityOrder = priorityOrder;
        this.isEnabled = isEnabled;
        this.parentId = parentId;
        this.lastModifierUserId = lastModifierUserId;
        this.lastModifiedDateTime = new Date(new Date().toUTCString());

        for (let key in this) {
            if (this[key] === undefined) delete this[key];
        }
    }
}

module.exports = AddReferenceAdminApiModel;
