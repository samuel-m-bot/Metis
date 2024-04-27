const ChangeRequest = require('../models/ChangeRequest')
const Activity = require('../models/Activity')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

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
        .populate({
            path: 'relatedDocuments',
            select: 'title type revisionNumber status'
        })
        .populate({
            path: 'relatedDesigns',
            select: 'name type revisionNumber status'
        })
        .populate({
            path: 'relatedProducts',
            select: 'name category lifecycleStatus revisionNumber'
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

    const activity = new Activity({
        actionType: 'Created',
        description: `New change request '${createdChangeRequest.title}' was created with ID ${createdChangeRequest._id}`,
        createdBy: req.user._id,
        relatedTo: createdChangeRequest._id,
        onModel: 'ChangeRequest',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
    });
    await activity.save();

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

    const activity = new Activity({
        actionType: 'Updated',
        description: `Change request '${updatedChangeRequest.title}' was updated with ID ${updatedChangeRequest._id}`,
        createdBy: req.user._id,
        relatedTo: updatedChangeRequest._id,
        onModel: 'ChangeRequest',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
    });
    await activity.save();

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

    const activity = new Activity({
        actionType: 'Deleted',
        description: `Change request '${changeRequest.title}' with ID ${changeRequest._id} was deleted`,
        createdBy: req.user._id,
        relatedTo: changeRequest._id,
        onModel: 'ChangeRequest',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
    });
    await activity.save();

    res.json({ message: `Change request ${changeRequest._id} deleted successfully` });

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

// @desc Add a comment to a change request
// @route POST /changeRequests/:id/comment
// @access private
const addCommentToChangeRequest = asyncHandler(async (req, res) => {
    const changeRequestId = req.params.id;
    const { text, postedBy } = req.body;

    console.log(text)
    console.log(postedBy)

    if (!text) {
        return res.status(400).json({ message: 'Comment text is required' });
    }

    const changeRequest = await ChangeRequest.findById(changeRequestId);

    if (!changeRequest) {
        return res.status(404).json({ message: 'Change request not found' });
    }

    const newComment = {
        text,
        postedBy: postedBy || req.user._id, // Assume `req.user._id` if `postedBy` is not provided
        postedDate: new Date()
    };

    changeRequest.comments.push(newComment);
    await changeRequest.save();

    const activity = new Activity({
        actionType: 'Commented',
        description: `A comment was added to change request ${changeRequestId} by user ${postedBy || req.user._id}`,
        createdBy: req.user._id,
        relatedTo: changeRequestId,
        onModel: 'ChangeRequest',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
    });
    await activity.save();

    res.status(201).json({
        message: 'Comment added successfully',
        comments: changeRequest.comments
    });
});

// @desc Delete a comment from a change request
// @route DELETE /changeRequests/:id/comment/:commentId
// @access private
const deleteCommentFromChangeRequest = asyncHandler(async (req, res) => {
    const changeRequestId = req.params.id;
    const commentId = req.params.commentId;

    const changeRequest = await ChangeRequest.findById(changeRequestId);

    if (!changeRequest) {
        return res.status(404).json({ message: 'Change request not found' });
    }

    const commentIndex = changeRequest.comments.findIndex(c => c._id.toString() === commentId);
    
    if (commentIndex === -1) {
        return res.status(404).json({ message: 'Comment not found' });
    }

    changeRequest.comments.splice(commentIndex, 1);
    await changeRequest.save();

    const activity = new Activity({
        actionType: 'Deleted',
        description: `A comment was deleted from change request ${changeRequestId}`,
        createdBy: req.user._id,
        relatedTo: changeRequestId,
        onModel: 'ChangeRequest',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
    });
    await activity.save();

    res.json({
        message: 'Comment deleted successfully',
        comments: changeRequest.comments
    });

});

// @desc Get all comments for a change request sorted by latest
// @route GET /changeRequests/:id/comments
// @access Private
const getCommentsForChangeRequest = asyncHandler(async (req, res) => {
    const { id } = req.params; 

    const changeRequest = await ChangeRequest.findById(id)
        .populate({
            path: 'comments.postedBy',
            select: 'firstName surname email'
        })
        .select('comments')
        .lean();

    if (!changeRequest) {
        return res.status(404).json({ message: 'Change request not found' });
    }

    const sortedComments = changeRequest.comments.sort((a, b) => b.postedDate - a.postedDate);

    res.json(sortedComments);
});


module.exports = {
    getAllChangeRequests,
    getChangeRequestById,
    createNewChangeRequest,
    updateChangeRequest,
    deleteChangeRequest,
    listChangeRequestsByStatus,
    getChangeRequestsByProjectAndStatus,
    getChangeRequestsByRelatedItem,
    getChangeRequestsByMainItem,
    addCommentToChangeRequest,
    deleteCommentFromChangeRequest,
    getCommentsForChangeRequest
}