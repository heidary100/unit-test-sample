const router = require('express').Router();
const {
    getReferences,
    addReference,
    findReferenceById,
    updateReferenceById,
    deleteReferenceById
} = require('../controllers/manage-references-controller');

router.get('/', getReferences);
router.post('/', addReference);
router.get('/:id', findReferenceById);
router.put('/:id', updateReferenceById);
router.delete('/:id', deleteReferenceById);

module.exports = router;