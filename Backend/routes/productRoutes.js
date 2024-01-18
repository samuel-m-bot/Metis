const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projectsController')

//@desc Routes for Product


router.route('/')
    .get(projectController.getAllProjects)
    .post(projectController.createNewProject)


router.route('/:id')
    .get(projectController.getProjectsById)
    .patch(projectController.updateProject)
    .delete(projectController.deleteProject)
module.exports = router