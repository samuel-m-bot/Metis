const express = require('express')
const router = express.Router()
const changeRequestController = require('../controllers/changeRequestsController')

//@desc Routes for ChangeRequest


router.route('/')
    .get(changeRequestController.getAllChangeRequests)
    .post(changeRequestController.createNewChangeRequest)


router.route('/:id')
    .get(changeRequestController.getChangeRequestById)
    .patch(changeRequestController.updateChangeRequest)
    .delete(changeRequestController.deleteChangeRequest)
module.exports = router