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

/// @desc Create a new change request
// @route POST /changeRequests
// @access private
const createNewChangeRequest = asyncHandler(async (req, res) => {
    const {
        requestedBy, projectId, title, description, status, priority, estimatedCompletionDate,
        assignedTo, comments, relatedDocuments, relatedDesigns, associatedTasks, relatedProducts
    } = req.body;

    // Validate required fields
    if (!requestedBy || !projectId || !title ||  !description || !status || !priority) {
        return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Create new change request
    const changeRequest = new ChangeRequest({
        requestedBy, projectId, title,  description, status, priority, estimatedCompletionDate,
        assignedTo, comments, relatedDocuments, relatedDesigns, associatedTasks, relatedProducts
    });

    const createdChangeRequest = await changeRequest.save();
    res.status(201).json(createdChangeRequest);
});


// @desc Update an existing change request
// @route PATCH /changeRequests/:id
// @access private
const updateChangeRequest = asyncHandler(async (req, res) => {
    const {
        description, status, title, priority, estimatedCompletionDate, approvalDate, assignedTo, comments,
        relatedDocuments, relatedDesigns, associatedTasks, relatedProducts
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

// @desc Submit a review for a change request
// @route POST /changeRequests/:id/review
// @access Private
const submitReview = asyncHandler(async (req, res) => {
    const { id } = req.params;  // Change request ID
    const { reviewData } = req.body;  // Review data from request body

    const changeRequest = await ChangeRequest.findById(id);
    let passedReview = false
    if (!changeRequest) {
        return res.status(404).json({ message: 'Change request not found' });
    }

    // Construct the review object based on the schema
    const newReview = {
        reviewer: req.user._id,  
        role: req.user.role, 
        reviewDate: new Date(),  
        feedback: reviewData.feedback,
        decision: reviewData.decision
    };

    // Add the review to the change request's reviews array
    changeRequest.reviews.push(newReview);

    // Check if all reviews are positive and it's the last needed review
    const allReviewsPositive = changeRequest.reviews.every(review => review.decision === 'Approved');
    if (allReviewsPositive) {
        changeRequest.status = 'Completed';
        passedReview = true
    }

    await changeRequest.save();

    // Create an activity log entry for the review
    const reviewActivity = new Activity({
        actionType: newReview.decision, 
        description: `Review submitted for change request ${id} by ${req.user._id}. Decision: ${newReview.decision}. Status updated to ${changeRequest.status}.`,
        createdBy: req.user._id,
        relatedTo: id,
        onModel: 'ChangeRequest',
    });
    await reviewActivity.save();

    if(passedReview){
        // Create an activity log entry for the review
        const completeReviewActivity = new Activity({
            actionType:'Completed', 
            description: `Review completed and all approved for CR: ${id}  Status updated to ${changeRequest.status}.`,
            createdBy: req.user._id,
            relatedTo: id,
            onModel: 'ChangeRequest',
        });
        await completeReviewActivity.save();
    }

    res.status(201).json({
        message: 'Review submitted successfully',
        review: newReview,
        changeRequest,
        activity: reviewActivity
    });
});


// @desc Send a change request out for review
// @route PATCH /changeRequests/:id/sendForReview
// @access Private
const sendOutForReview = asyncHandler(async (req, res) => {
    const { id } = req.params; // Change request ID
    const { reviewers } = req.body; // Array of reviewer IDs

    const changeRequest = await ChangeRequest.findById(id).populate('projectId');

    if (!changeRequest) {
        return res.status(404).json({ message: 'Change request not found' });
    }

    // Update the change request's status to 'In Review'
    changeRequest.status = 'In Review';
    await changeRequest.save();

    // Create tasks for each reviewer
    const tasks = await Promise.all(reviewers.map(async (reviewerId) => {
        const taskData = {
            projectId: changeRequest.projectId._id,
            name: 'Review Item',
            description: 'Tasked to download item and either approve or reject this review',
            status: 'In Progress',
            priority: changeRequest.priority,
            assignedTo: [reviewerId],
            taskType: 'Review',
            dueDate: changeRequest.estimatedCompletionDate,
            relatedTo: 'ChangeRequest',
        };

        const newTask = new Task(taskData);
        await newTask.save();

        return newTask;
    }));

    // if (reviewers && reviewers.length > 0) {
    //     reviewers.forEach(async (reviewerId) => {
    //         const user = await User.findById(reviewerId);
    //         if (user) {
    //             sendNotification(user.email, `You have been selected to review the change request: ${changeRequest.title}. A review task has been created for you.`);
    //         }
    //     });
    // }

    // Log activity
    const activity = new Activity({
        actionType: 'Sent for Review',
        description: `Change request ${id} sent out for review. Tasks created for reviewers.`,
        createdBy: req.user._id,
        relatedTo: id,
        onModel: 'ChangeRequest',
    });
    await activity.save();

    res.json({
        message: 'Change request sent out for review, tasks created for all reviewers',
        changeRequest,
        tasks
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
    approveRejectChangeRequest,
    getChangeRequestsByProjectAndStatus,
    getChangeRequestsByRelatedItem,
    submitReview,
    sendOutForReview
}