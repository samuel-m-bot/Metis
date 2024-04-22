const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectsController');
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

// Routes for managing projects
router.route('/')
    .get(projectController.getAllProjects) // Get all projects
    .post(projectController.createNewProject); // Create a new project

router.route('/:id')
    .get(projectController.getProjectById) // Get a project by ID
    .patch(projectController.updateProject) // Update a project
    .delete(projectController.deleteProject); // Delete a project

// Additional project-specific routes
router.get('/search', projectController.searchProjects); // Search for projects
router.get('/:id/TeaMember', projectController.getProjectTeamDetails); // Gets the member details of the project
router.patch('/:id/addTeamMember', projectController.addTeamMember); // Add a team member to a project
router.patch('/:id/removeTeamMember', projectController.removeTeamMember); // Remove a team member from a project
router.get('/:id/changeRequests', projectController.listProjectChangeRequests); // List change requests for a project
router.patch('/:id/status', projectController.updateProjectStatus); // Update project status
router.patch('/:id/archive', projectController.archiveProject); // Archive a project
router.get('/assigned/:userId', projectController.getAssignedProjects); // Getting assigned projects for the user
router.get('/:id/reviewers', projectController.getReviewers); // Fetch reviewers for a project


module.exports = router;
