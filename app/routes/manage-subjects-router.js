const router = require('express').Router();
const subjects = require('../controllers/manage-subjects-controller');

router.post('/', subjects.addSubject);
router.get('/:id', subjects.findSubjectById);
router.put('/:id', subjects.updateSubjectById);
router.delete('/:id', subjects.deleteSubjectById);
router.get('/', subjects.getSubjects);

module.exports = router;
