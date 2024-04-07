const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// Route for logging a new activity
router.post('/', activityController.logActivity); // Log a new activity

// Route for getting activities related to a specific entity
router.get('/:onModel/:relatedTo', activityController.getActivitiesForEntity); // Get activities for a specific entity

// Route for getting all activities (with optional filtering)
router.get('/', activityController.getAllActivities); // Get all activities (with optional filtering)

// Route for updating an activity (typically not common for activity logs)
router.patch('/:id', activityController.updateActivity); // Update an activity

// Route for deleting an activity (typically restricted to administrators)
router.delete('/:id', activityController.deleteActivity); // Delete an activity

module.exports = router;
