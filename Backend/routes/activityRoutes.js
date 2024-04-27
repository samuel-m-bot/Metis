const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

// Route for getting all activities (with optional filtering)
router.get('/', activityController.getAllActivities); // Get all activities (with optional filtering)
router.get('/user/:userId', activityController.getUserActivities); // Get all activities for a specific user
router.get('/by-context', activityController.getActivitiesByRelatedToAndModel); // Get activities based on relatedTo and onModel

// Route for updating an activity (typically not common for activity logs)
router.patch('/:id', activityController.updateActivity); // Update an activity

// Route for deleting an activity (typically restricted to administrators)
router.delete('/:id', activityController.deleteActivity); // Delete an activity

module.exports = router;
