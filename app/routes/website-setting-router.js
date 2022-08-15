const router = require('express').Router();
const websiteSettingController = require('../controllers/website-settings-controller');

router.get('/', websiteSettingController.getWebsiteSetting);

module.exports = router;
