const Activity = require('../models/Activity');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose')

// @desc Get all activities (with optional filtering)
// @route GET /activities
// @access Private
const getAllActivities = asyncHandler(async (req, res) => {
    const { actionType, onModel, startDate, endDate, page = 1, limit = 10 } = req.query;
    let query = {};

    if (actionType) query.actionType = actionType;
    if (onModel) query.onModel = onModel;
    if (startDate && endDate) {
        query.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
        query.timestamp = { $gte: new Date(startDate) };
    } else if (endDate) {
        query.timestamp = { $lte: new Date(endDate) };
    }

    const skip = (page - 1) * limit;

    try {
        const activities = await Activity.find(query)
            .populate({
                path: 'createdBy',
                select: 'firstName surname -_id'
            })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);

        const count = await Activity.countDocuments(query);

        if (activities.length === 0) {
            return res.status(404).json({ message: 'No activities found' });
        }

        res.json({
            activities: activities.map(activity => ({
                ...activity.toJSON(),
                createdBy: activity.createdBy ? `${activity.createdBy.firstName} ${activity.createdBy.surname}` : "Unknown User"
            })),
            currentPage: Number(page),
            totalPages: Math.ceil(count / limit),
            totalActivities: count
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activities', error: error.message });
    }
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

// @desc Get all activities for a specific user sorted by latest
// @route GET /activities/user/:userId
// @access Private
const getUserActivities = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 5 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ status: 'error', message: 'Invalid user ID format' });
    }

    // Adding populate to include firstName and surname from the User model
    const activities = await Activity.find({ createdBy: userId })
        .populate({
            path: 'createdBy', 
            select: 'firstName surname' 
        })
        .sort({ timestamp: 1 })
        .skip((page - 1) * limit)
        .limit(limit);

    const count = await Activity.countDocuments({ createdBy: userId });

    if (!activities.length) {
        return res.status(404).json({ status: 'error', message: 'No activities found for this user' });
    }

    const totalPages = Math.ceil(count / limit);
    res.json({
        status: 'success',
        activities,
        count,
        currentPage: page,
        totalPages,
        nextPage: page < totalPages ? `?page=${page + 1}&limit=${limit}` : null,
        prevPage: page > 1 ? `?page=${page - 1}&limit=${limit}` : null
    });
});

// @desc Get all activities by relatedTo ID and onModel type
// @route GET /activities/by-context
// @access Private
const getActivitiesByRelatedToAndModel = asyncHandler(async (req, res) => {
    const { relatedTo, onModel, page = 1, limit = 10 } = req.query;

    // Validate the input parameters
    if (!mongoose.Types.ObjectId.isValid(relatedTo)) {
        return res.status(400).json({ message: 'Invalid relatedTo ID format' });
    }
    if (!onModel) {
        return res.status(400).json({ message: 'onModel type is required' });
    }

    const activities = await Activity.find({
        relatedTo: relatedTo,
        onModel: onModel
    })
    .sort({ timestamp: -1 }) 
    .skip((page - 1) * limit) 
    .limit(limit) 
    .exec();

    const count = await Activity.countDocuments({
        relatedTo: relatedTo,
        onModel: onModel
    });

    if (!activities.length) {
        return res.status(404).json({ message: 'No activities found for the specified criteria' });
    }

    res.json({
        activities,
        currentPage: page,
        totalPages: Math.ceil(count / limit)
    });
});

module.exports = {
    getAllActivities,
    updateActivity,
    deleteActivity,
    getUserActivities,
    getActivitiesByRelatedToAndModel,
};
