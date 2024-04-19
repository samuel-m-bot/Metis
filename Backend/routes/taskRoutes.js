const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Routes for managing tasks
router.route('/')
    .get(taskController.getAllTasks) // Get all tasks
    .post(taskController.createTask); // Create a new task

router.route('/:id')
    .get(taskController.getTaskById) // Get a task by ID
    .patch(taskController.updateTask) // Update a task
    .delete(taskController.deleteTask); // Delete a task

// Routes for subtasks
router.post('/:id/subtasks', taskController.addSubtask); // Add a subtask to a task
router.patch('/:taskId/subtasks/:subtaskId', taskController.updateSubtask); // Update a subtask

// Route for checklist items
router.patch('/:taskId/checklist/:itemId', taskController.toggleChecklistItem); // Mark a checklist item as completed

// Routes for comments
router.post('/:id/comments', taskController.addCommentToTask); // Add a comment to a task
router.patch('/:taskId/comments/:commentId', taskController.editTaskComment); // Edit a task comment

// Route to get tasks assigned to a specific user
router.get('/user/:userId', taskController.getUserTasks); // Get tasks for a specific user

router.post('/filter', taskController.filterTasks);

router.get('/project/:projectId', taskController.getTasksByProjectId);
module.exports = router;
