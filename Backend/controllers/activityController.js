const Activity = require('../models/Activity');
const asyncHandler = require('express-async-handler');

// @desc Log a new activity
// @route POST /activities
// @access Private
const logActivity = asyncHandler(async (req, res) => {
    const { actionType, description, createdBy, relatedTo, onModel } = req.body;

    if (!actionType || !description || !createdBy || !relatedTo || !onModel) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const activity = new Activity({
        actionType,
        description,
        createdBy,
        relatedTo,
        onModel,
    });

    const savedActivity = await activity.save();
    res.status(201).json(savedActivity);
});


// @desc Get activities for a specific entity
// @route GET /activities/:onModel/:relatedTo
// @access Private
const getActivitiesForEntity = asyncHandler(async (req, res) => {
    const { onModel, relatedTo } = req.params;

    if (!onModel || !relatedTo) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    const activities = await Activity.find({ onModel, relatedTo });

    if (activities.length === 0) {
        return res.status(404).json({ message: 'No activities found for this entity' });
    }

    res.json(activities);
});


// @desc Get all activities (with optional filtering)
// @route GET /activities
// @access Private
const getAllActivities = asyncHandler(async (req, res) => {
    const { actionType, onModel, startDate, endDate } = req.query;
    let query = {};

    if (actionType) query.actionType = actionType;
    if (onModel) query.onModel = onModel;
    if (startDate && endDate) {
        query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
        query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
        query.createdAt = { $lte: new Date(endDate) };
    }

    const activities = await Activity.find(query);

    if (activities.length === 0) {
        return res.status(404).json({ message: 'No activities found' });
    }

    res.json(activities);
});


// @desc Update an activity (if needed, typically not common for activity logs)
// @route PATCH /activities/:id
// @access Private
const updateActivity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { actionType, description, createdBy, relatedTo, onModel } = req.body;

    // Find the activity by ID
    const activity = await Activity.findById(id);

    // Check if the activity exists
    if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
    }

    // Update the activity with new values if provided
    activity.actionType = actionType || activity.actionType;
    activity.description = description || activity.description;
    activity.createdBy = createdBy || activity.createdBy;
    activity.relatedTo = relatedTo || activity.relatedTo;
    activity.onModel = onModel || activity.onModel;

    // Save the updated activity
    const updatedActivity = await activity.save();
    res.status(200).json(updatedActivity);
});


// @desc Delete an activity (if needed, typically restricted to administrators)
// @route DELETE /activities/:id
// @access Private
const deleteActivity = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find the activity by ID
    const activity = await Activity.findById(id);

    // Check if the activity exists
    if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
    }

    // Delete the activity
    await activity.remove();
    res.status(200).json({ message: 'Activity deleted successfully' });
});


module.exports = {
    logActivity,
    getActivitiesForEntity,
    getAllActivities,
    updateActivity,
    deleteActivity,
};
