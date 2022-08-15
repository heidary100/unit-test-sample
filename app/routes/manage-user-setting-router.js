const router = require('express').Router();
const userSetting = require('../controllers/manage-user-setting-controller');

router.get('/notificationlevel', userSetting.getNotificationLevelByUserId);
router.put('/notificationlevel', userSetting.updateNotificationLevelByUserId);
router.get('/twosteplogintype', userSetting.getTwoStepLoginTypeByUserId);
router.put('/twosteplogintype', userSetting.updateTwoStepLoginTypeByUserId);

module.exports = router;
