const ChangeRequest = require('../models/ChangeRequest')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const Activity = require('../models/Activity');

// @desc Get all changeRequests
// @route GET /changeRequests
// @access private
const getAllChangeRequests = asyncHandler(async (req, res) => {
    const changeRequests = await ChangeRequest.find().lean()
    if(!changeRequests?.length){
        return res.status(400).json({ message: 'No changeRequests found'})
    }
    res.json(changeRequests)
})

// @desc Get specific changeRequests
// @route GET /changeRequests
// @access private
const getChangeRequestById = asyncHandler(async (req, res) => {
    const changeRequests = await ChangeRequest.findById(req.params.id).lean()
    if(!changeRequests){
        return res.status(400).json({ message: 'No changeRequest found with that ID'})
    }
    res.json(changeRequests)
})

// @desc Create a new change request
// @route POST /changeRequests
// @access private
const createNewChangeRequest = asyncHandler(async (req, res) => {
    const { productID, requestedBy, description, status, priority, estimatedCompletionDate, assignedTo, comments, relatedDocuments } = req.body

    // Validate required fields
    if (!productID || !requestedBy || !description || !status) {
        return res.status(400).json({ message: 'Required fields are missing' })
    }

    // Create new change request
    const changeRequest = new ChangeRequest({ productID, requestedBy, description, status, priority, estimatedCompletionDate, assignedTo, comments, relatedDocuments })

    const createdChangeRequest = await changeRequest.save()
    res.status(201).json(createdChangeRequest);
})

// @desc Update an existing change request
// @route PATCH /changeRequests/:id
// @access private
const updateChangeRequest = asyncHandler(async (req, res) => {
    const changeRequestId = req.params.id;
    const changeRequest = await ChangeRequest.findById(changeRequestId)

    if (!changeRequest) {
        return res.status(404).json({ message: 'Change request not found' })
    }

    // Update fields if provided
    changeRequest.status = req.body.status || changeRequest.status
    changeRequest.priority = req.body.priority || changeRequest.priority
    changeRequest.estimatedCompletionDate = req.body.estimatedCompletionDate || changeRequest.estimatedCompletionDate
    changeRequest.assignedTo = req.body.assignedTo || changeRequest.assignedTo
    changeRequest.comments = req.body.comments || changeRequest.comments
    changeRequest.relatedDocuments = req.body.relatedDocuments || changeRequest.relatedDocuments

    const updatedChangeRequest = await changeRequest.save()
    res.json({ message: `Change request '${updatedChangeRequest._id}' updated` })
})

// @desc Delete a changeRequest
// @route DELETE /changeRequests
// @access private
const deleteChangeRequest = asyncHandler(async (req, res) => {
    const changeRequest = await ChangeRequest.findById(req.params.id);

    if (!changeRequest) {
        return res.status(404).json({ message: 'ChangeRequest not found' });
    }

    const result = await changeRequest.deleteOne()

    const reply = `ChangeRequest ${result.name} with ID ${result._id} deleted`

    res.json(reply)
})

// @desc List change requests by status
// @route GET /changeRequests/status/:status
// @access private
const listChangeRequestsByStatus = asyncHandler(async (req, res) => {
    const { status } = req.params; // Get status from URL params

    // Find change requests with the given status
    const changeRequests = await ChangeRequest.find({ status: status });

    if (!changeRequests.length) {
        return res.status(404).json({ message: `No change requests found with status ${status}` });
    }

    res.json(changeRequests);
});


// @desc Assign a change request to a user
// @route PATCH /changeRequests/:id/assign
// @access private
const assignChangeRequest = asyncHandler(async (req, res) => {
    const { userId } = req.body; // ID of the user to whom the request is assigned
    const changeRequestId = req.params.id; // ID of the change request

    const changeRequest = await ChangeRequest.findById(changeRequestId);

    if (!changeRequest) {
        return res.status(404).json({ message: 'Change request not found' });
    }

    // Optionally, verify the user exists
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Assign the change request
    changeRequest.assignedTo = userId;
    await changeRequest.save();

    const newActivity = new Activity({
        actionType: 'Assigned',
        description: `Change request ${changeRequestId} assigned to user ${userId}`,
        createdBy: req.user._id,
        relatedTo: changeRequestId,
        onModel: 'ChangeRequest',
    });
    await newActivity.save();

    res.json({ message: `Change request ${changeRequestId} assigned to user ${userId}` });
});

// @desc Approve or reject a change request
// @route PATCH /changeRequests/:id/approveReject
// @access private
const approveRejectChangeRequest = asyncHandler(async (req, res) => {
    const { approvalStatus } = req.body; // Expected to be either 'Approved' or 'Rejected'
    const changeRequestId = req.params.id;

    const changeRequest = await ChangeRequest.findById(changeRequestId);

    if (!changeRequest) {
        return res.status(404).json({ message: 'Change request not found' });
    }

    if (!['Approved', 'Rejected'].includes(approvalStatus)) {
        return res.status(400).json({ message: 'Invalid approval status' });
    }

    changeRequest.approvalStatus = approvalStatus;
    await changeRequest.save();

    const approvalActivity = new Activity({
        actionType: approvalStatus, 
        description: `Change request ${changeRequestId} has been ${approvalStatus.toLowerCase()}`,
        createdBy: req.user._id,
        relatedTo: changeRequestId,
        onModel: 'ChangeRequest',
    });
    await approvalActivity.save();

    res.json({
        message: `Change request ${changeRequestId} has been ${approvalStatus.toLowerCase()}`,
        changeRequest
    });
});

module.exports = {
    getAllChangeRequests,
    getChangeRequestById,
    createNewChangeRequest,
    updateChangeRequest,
    deleteChangeRequest,
    listChangeRequestsByStatus,
    assignChangeRequest,
    approveRejectChangeRequest
}