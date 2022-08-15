class UpdateGuideAPIModel {
    constructor(id, body) {
        if (body.title !== undefined) {
            this.title = body.title;
        }
        if (body.text !== undefined) {
            this.text = body.text;
        }
        if (body.priorityOrder !== undefined) {
            this.priorityOrder = body.priorityOrder;
        }
        if (body.isEnabled !== undefined) {
            this.isEnabled = body.isEnabled;
        }
        if (body.tags !== undefined) {
            this.tags = body.tags;
        }
        if (body.subjectId !== undefined) {
            this.subjectId = body.subjectId;
        }
        if (id !== undefined) {
            this.id = id;
        }
    }
}

module.exports = UpdateGuideAPIModel;
