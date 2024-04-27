const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

// Task management routes
router.route('/')
    .get(taskController.getAllTasks) // Get all tasks with optional pagination
    .post(taskController.createTask); // Create a new task

router.route('/:id')
    .get(taskController.getTaskById) // Get a task by ID
    .patch(taskController.updateTask) // Update a task
    .delete(taskController.deleteTask); // Delete a task

// Subtask management
router.post('/:id/subtasks', taskController.addSubtask);
router.patch('/:taskId/subtasks/:subtaskId', taskController.updateSubtask);

// Checklist item management
router.patch('/:taskId/checklist/:itemId', taskController.toggleChecklistItem);

// Comment management on tasks
router.post('/:id/comments', taskController.addCommentToTask);
router.patch('/:taskId/comments/:commentId', taskController.editTaskComment);

// Specific queries
router.get('/user/:userId', taskController.getUserTasks); 
router.get('/project/:projectId', taskController.getTasksByProjectId); 

// Special task management routes
router.post('/filter', taskController.filterTasks);
router.post('/manage-review-tasks', taskController.manageReviewTasks);
router.post('/manage-revised-task', taskController.manageRevisedTask);
router.post('/complete-and-setup-review', taskController.completeTaskAndSetupReview);
router.patch('/:id/status', taskController.handleUpdateTaskStatus);

module.exports = router;
