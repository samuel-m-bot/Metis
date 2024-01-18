const express = require('express')
const router = express.Router()
const userController = require('../controllers/usersController')

//@desc Routes for User


router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createNewUser)


router.route('/:id')
    .get(userController.getUsersById)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)
module.exports = router