class UpdateSubjectApiModel {
    constructor({title, priorityOrder, isEnabled}) {
        this.title = title;
        this.priorityOrder = priorityOrder;
        this.isEnabled = isEnabled;
    }
}

module.exports = UpdateSubjectApiModel;
