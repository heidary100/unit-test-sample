class UpdateWebsiteSettingAdminApiModel {
    constructor(body) {
        this.title = body.title;
        this.contactUsText = body.contactUsText;
        this.aboutUsText = body.aboutUsText;
        this.description = body.description;
        this.keywords = body.keywords;
    }
}

module.exports = UpdateWebsiteSettingAdminApiModel;
