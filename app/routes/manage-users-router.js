const router = require('express').Router();
const users = require('../controllers/manage-users-controller');

router.get('/', users.getUsers);
router.post('/', users.addUser);
router.get('/:id', users.getUserById);
router.put('/:id', users.updateUserById);
router.delete('/:id', users.delUserById);

module.exports = router;
