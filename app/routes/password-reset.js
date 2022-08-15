const router = require('express').Router();
const { forgetPassword, resetPassword } = require('../controllers/password-reset');

router.post('/forgetPassword', forgetPassword);
router.post('/resetPassword/:token', resetPassword);

module.exports = router;
