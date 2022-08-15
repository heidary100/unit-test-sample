const router = require('express').Router();
const {
    addGuide,
    getGuides,
    findGuideById,
    updateGuideById,
    deleteGuideById
} = require('../controllers/manage-guides-controller');

router.post('/', addGuide);
router.get('/', getGuides);
router.get('/:id', findGuideById);
router.put('/:id', updateGuideById);
router.delete('/:id', deleteGuideById);

module.exports = router;
