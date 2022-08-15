const router = require('express').Router();
const { findGuideById } = require('../controllers/guides-controller');

router.get('/:id', findGuideById);

module.exports = router;
