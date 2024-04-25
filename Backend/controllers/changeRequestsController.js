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
        return res.status(400).json({ message: 'No Change Requests found'})
    }
    res.json(changeRequests)
})

// @desc Get specific change request by ID
// @route GET /changeRequests/:id
// @access Private
const getChangeRequestById = asyncHandler(async (req, res) => {
    const changeRequestId = req.params.id; 
    const changeRequest = await ChangeRequest.findById(changeRequestId)
        .populate({
            path: 'assignedTo',
            select: 'firstName surname' 
        })
        .populate({
            path: 'requestedBy',
            select: 'firstName surname' 
        })
        .lean(); 

    if (!changeRequest) {
        return res.status(404).json({ message: 'No change request found with that ID' });
    }

    res.json(changeRequest);
});

/// @desc Create a new change request
// @route POST /changeRequests
// @access private
const createNewChangeRequest = asyncHandler(async (req, res) => {
    const {
        requestedBy, projectId, title, description, status, priority, estimatedCompletionDate,
        assignedTo, comments, relatedDocuments, relatedDesigns, associatedTasks, relatedProducts,
        mainItem, onModel, changeType, riskAssessment, impactLevel, revisionType
    } = req.body;

    // Validate required fields
    if (!requestedBy || !projectId || !title ||  !description || !status 
        || !priority || !mainItem || !onModel || !changeType || !riskAssessment
        || !impactLevel || !revisionType) {
        return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Create new change request
    const changeRequest = new ChangeRequest({
        requestedBy, projectId, title,  description, status, priority, estimatedCompletionDate,
        assignedTo, comments, relatedDocuments, relatedDesigns, associatedTasks, relatedProducts,
        mainItem, onModel, changeType, riskAssessment, impactLevel, revisionType
    });

    const createdChangeRequest = await changeRequest.save();

    // Populate the 'assignedTo' field
    const populatedChangeRequest = await ChangeRequest.findById(createdChangeRequest._id)
        .populate('assignedTo', 'firstName surname'); // only populate firstName and surname

    res.status(201).json(populatedChangeRequest);
});


// @desc Update an existing change request
// @route PATCH /changeRequests/:id
// @access private
const updateChangeRequest = asyncHandler(async (req, res) => {
    const {
        description, status, title, priority, estimatedCompletionDate, 
        approvalDate, assignedTo, comments,relatedDocuments, 
        relatedDesigns, associatedTasks, relatedProducts, mainItem, 
        onModel, changeType, riskAssessment, impactLevel, revisionType
    } = req.body;
    const changeRequestId = req.params.id;

    const changeRequest = await ChangeRequest.findById(changeRequestId);
    if (!changeRequest) {
        return res.status(404).json({ message: 'Change request not found' });
    }

    changeRequest.title = title || changeRequest.title;
    changeRequest.description = description || changeRequest.description;
    changeRequest.status = status || changeRequest.status;
    changeRequest.priority = priority || changeRequest.priority;
    changeRequest.estimatedCompletionDate = estimatedCompletionDate || changeRequest.estimatedCompletionDate;
    changeRequest.approvalDate = approvalDate || changeRequest.approvalDate;
    changeRequest.assignedTo = assignedTo || changeRequest.assignedTo;
    changeRequest.comments = comments || changeRequest.comments;
    changeRequest.relatedDocuments = relatedDocuments || changeRequest.relatedDocuments;
    changeRequest.relatedDesigns = relatedDesigns || changeRequest.relatedDesigns;
    changeRequest.associatedTasks = associatedTasks || changeRequest.associatedTasks;
    changeRequest.relatedProducts = relatedProducts || changeRequest.relatedProducts;
    changeRequest.mainItem = mainItem || changeRequest.mainItem;
    changeRequest.onModel = onModel || changeRequest.onModel;
    changeRequest.changeType = changeType || changeRequest.changeType;
    changeRequest.riskAssessment = riskAssessment || changeRequest.riskAssessment;
    changeRequest.impactLevel = impactLevel || changeRequest.impactLevel;
    changeRequest.revisionType = revisionType || changeRequest.revisionType;

    const updatedChangeRequest = await changeRequest.save();
    res.json(updatedChangeRequest);
});


// @desc Delete a changeRequest
// @route DELETE /changeRequests
// @access private
const deleteChangeRequest = asyncHandler(async (req, res) => {
    const changeRequest = await ChangeRequest.findById(req.params.id);

    if (!changeRequest) {
        return res.status(404).json({ message: 'ChangeRequest not found' });
    }

    await ChangeRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: `Change request : ${changeRequest._id} deleted successfully` });
});

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

// @desc Get change requests by Project ID and Status
// @route GET /changeRequests/project/:projectId/:status
// @access Private
const getChangeRequestsByProjectAndStatus = asyncHandler(async (req, res) => {
    const { projectId, status } = req.params;

    // Create a query to find the change requests with the required conditions
    const changeRequests = await ChangeRequest.find({ projectId, status })
        .populate({
            path: 'requestedBy',
            select: 'firstName surname'
        })
        .populate({
            path: 'assignedTo',
            select: 'firstName surname'
        });

    // Check if any change requests were found
    if (changeRequests.length === 0) {
        return res.status(404).json({ message: 'No change requests found' });
    }

    res.json(changeRequests);
});

// @desc Get change requests by related item ID and type
// @route GET /change-requests/:type/:itemId
// @access Private
const getChangeRequestsByRelatedItem = asyncHandler(async (req, res) => {
   console.log(req.params)
    const { type, itemId } = req.params;
    let query = {};

    switch (type) {
        case 'Document':
            query = { relatedDocuments: itemId };
            break;
        case 'Design':
            query = { relatedDesigns: itemId };
            break;
        case 'Product':
            query = { relatedProducts: itemId };
            break;
        default:
            return res.status(400).json({ message: 'Invalid type specified' });
    }

    const changeRequests = await ChangeRequest.find(query)
        .populate('requestedBy', 'name')
        .populate('assignedTo', 'name');

    if (!changeRequests.length) {
        return res.status(404).json({ message: 'No change requests found' });
    }

    res.json(changeRequests);
});

// @desc Get change requests by main item ID
// @route GET /change-requests/main-item/:mainItemId
// @access Private
const getChangeRequestsByMainItem = asyncHandler(async (req, res) => {
    const { mainItemId } = req.params;

    const changeRequests = await ChangeRequest.find({ mainItem: mainItemId })
        .populate('requestedBy', 'firstName surname')
        .populate('assignedTo', 'firstName surname');

    if (!changeRequests.length) {
        return res.status(404).json({ message: 'No change requests found for this main item' });
    }

    res.json(changeRequests);
});



module.exports = {
    getAllChangeRequests,
    getChangeRequestById,
    createNewChangeRequest,
    updateChangeRequest,
    deleteChangeRequest,
    listChangeRequestsByStatus,
    assignChangeRequest,
    approveRejectChangeRequest,
    getChangeRequestsByProjectAndStatus,
    getChangeRequestsByRelatedItem,
    getChangeRequestsByMainItem
}