class AddReferenceAdminApiModel {
    constructor({ title, text, priorityOrder, isEnabled, parentId, lastModifierUserId }) {
        this.title = title;
        this.text = text;
        this.priorityOrder = priorityOrder;
        this.isEnabled = isEnabled;
        this.parentId = parentId;
        this.lastModifierUserId = lastModifierUserId;
        this.lastModifiedDateTime = new Date(new Date().toUTCString());
    }
}

module.exports = AddReferenceAdminApiModel;
