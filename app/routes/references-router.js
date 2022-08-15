const router = require('express').Router();
const { getReferences, findReferenceById } = require('../controllers/references-controller');

router.get('/', getReferences);
router.get('/:id', findReferenceById);

module.exports = router;