const express = require('express');
const { userController } = require('../controllers');

const router = express.Router();

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers)
router.get('/sellers', userController.getSellers);
router.delete('/:id', userController.deleteUser)

module.exports = router;