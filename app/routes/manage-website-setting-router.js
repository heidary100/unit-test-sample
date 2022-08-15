const router = require('express').Router();
const manageWebsiteSetting = require('../controllers/manage-website-settings-controller');

router.get('/', manageWebsiteSetting.getWebsiteSetting);
router.put('/', manageWebsiteSetting.updateWebsiteSetting);

module.exports = router;
