const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(usersController.getAllUsers)
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router.route('/getUser')
    .get(usersController.getUser);

router.route('/getRooms')
    .get(usersController.getLoggedInUserRooms);

router.route('/modify-username')
    .put(usersController.modifyUsername)

router.route('/modify-password')
    .put(usersController.modifyPassword)

router.route('/delete-chat/:roomId')
    .delete(usersController.deleteChat)


router.route('/getUserByUsername/:userId')
    .get(usersController.getUserById);

module.exports = router;