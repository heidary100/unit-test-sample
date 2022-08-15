class UpdateNotificationLevelApiModel {
    constructor(id, body) {
        this.id = id;
        if (body.notificationLevel !== undefined) {
            this.notificationLevel = body.notificationLevel;
        }
    }
}

module.exports = UpdateNotificationLevelApiModel;
