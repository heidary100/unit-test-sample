const router = require('express').Router();
const subjects = require('../controllers/subjects-controller');

router.get('/:id', subjects.findSubjectById);
router.get('/', subjects.getSubjects);

module.exports = router;
