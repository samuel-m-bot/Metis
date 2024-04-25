const ChangeRequest = require('../models/ChangeRequest');
const Task = require('../models/Tasks');
const Project = require('../models/Project');
const asyncHandler = require('express-async-handler');

const models = {
    Document: require('../models/Document'),
    Design: require('../models/Design'),
    Product: require('../models/Product'),
};
// @desc Check if the user can check out and in an item
// @route GET /api/items/:itemId/can-check-out/:userId
// @access Private
const canUserCheckOutAndInItem = asyncHandler(async (req, res) => {
    const { itemId, userId } = req.params;

    // Find 'Approved' change requests related to the item
    const changeRequests = await ChangeRequest.find({
        $or: [
            { mainItem: itemId },
            { relatedDocuments: itemId },
            { relatedDesigns: itemId },
            { relatedProducts: itemId }
        ],
        status: 'Approved'
    }).select('_id projectId');

    if (changeRequests.length === 0) {
        return res.status(404).json({ message: 'No approved change requests found for this item.' });
    }

    const projectIds = changeRequests.map(cr => cr.projectId);

    // Find update tasks associated with these change requests that are assigned to the user
    const updateTasks = await Task.find({
        assignedChangeRequest: { $in: changeRequests.map(cr => cr._id) },
        assignedTo: userId,
        taskType: 'Update'
    });

    if (updateTasks.length === 0) {
        return res.status(403).json({ message: 'No active update tasks found for this user on the item.' });
    }

    // Ensure the user is part of the project team with the required permissions
    const userProjects = await Project.find({
        '_id': { $in: projectIds },
        'teamMembers': {
            $elemMatch: {
                userId: userId,
                permissions: { $all: ["Read", "Write"] }
            }
        }
    });

    if (userProjects.length === 0) {
        return res.status(403).json({ message: 'You do not have the necessary permissions to check out this item.' });
    }

    res.json({ message: 'You can check out this item.', authorized: true });
});

// @desc Check out an item for updates
// @route POST /api/items/:itemId/check-out/:userId
// @access Private
const checkOutItem = asyncHandler(async (req, res) => {
    const { itemId, itemType, userId } = req.params;
    const Model = models[itemType];

    if (!Model) {
        return res.status(400).json({ message: 'Invalid item type specified' });
    }

    const item = await Model.findById(itemId);
    if (!item) {
        return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status === 'Checked Out') {
        return res.status(400).json({ message: 'Item is already checked out' });
    }

    const updatedItem = await Model.findByIdAndUpdate(itemId, { status: 'Checked Out' }, { new: true });
    res.json({ message: 'Item checked out successfully', item: updatedItem });
});



// @desc Check in an updated item
// @route POST /api/items/:itemId/check-in/:userId
// @access Private
const checkInItem = asyncHandler(async (req, res) => {
    const { itemId, itemType, userId } = req.params;
    const Model = models[itemType];

    if (!Model) {
        return res.status(400).json({ message: 'Invalid item type specified' });
    }

    const currentItem = await Model.findById(itemId);
    if (currentItem && currentItem.status === 'Checked In') {
        return res.status(400).json({ message: 'Item is already checked in' });
    }

    const updatedItem = await Model.findByIdAndUpdate(itemId, { status: 'Checked In' }, { new: true });
    if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ success: true, message: 'Item checked in successfully', item: updatedItem });
});

module.exports = {
    canUserCheckOutAndInItem,
    checkOutItem,
    checkInItem
};