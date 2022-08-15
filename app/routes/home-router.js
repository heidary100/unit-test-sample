const router = require('express').Router();

const { search } = require('../controllers/home-controller');

router.get('/search', search);

module.exports = router;
