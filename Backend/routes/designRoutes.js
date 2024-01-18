const express = require('express')
const router = express.Router()
const designController = require('../controllers/designsController')

//@desc Routes for Design


router.route('/')
    .get(designController.getAllDesigns)
    .post(designController.createNewDesign)


router.route('/:id')
    .get(designController.getDesignById)
    .patch(designController.updateDesign)
    .delete(designController.deleteDesign)
module.exports = router