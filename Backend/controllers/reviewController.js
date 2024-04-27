const Review = require('../models/Review');
const Task = require('../models//Tasks')
const Activity = require('../models/Activity')
const ChangeRequest = require('../models/ChangeRequest')
const asyncHandler = require('express-async-handler');

const models = {
    Document: require('../models/Document'),
    Design: require('../models/Design'),
    Product: require('../models/Product'),
    ChangeRequest: require('../models/ChangeRequest')
};
// @desc Get all reviews
// @route GET /reviews
// @access Private
const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find()
    if (!reviews.length) {
        return res.status(404).json({ message: 'No reviews found' });
    }
    res.json(reviews);
});

// @desc Get specific review by ID
// @route GET /reviews/:id
// @access Private
const getReviewById = asyncHandler(async (req, res) => {
    const reviewId = req.params.id; 
    const review = await Review.findById(reviewId)
        .populate({
            path: 'reviewers.userId', 
            select: 'firstName surname' 
        })
        .lean(); 

    if (!review) {
        return res.status(404).json({ message: 'No review found with that ID' });
    }

    res.json(review);
});

// @desc Create new review
// @route POST /reviews
// @access Private
const createNewReview = asyncHandler(async (req, res) => {
    const { itemReviewed, onModel, reviewers, reviewType } = req.body;
    if (!itemReviewed || !onModel || !reviewers) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const review = new Review({ itemReviewed, onModel, reviewers, reviewType });
    const createdReview = await review.save();

    const activity = new Activity({
        actionType: 'Created',
        description: `New review was created with ID ${review._id}`,
        createdBy: req.user._id,
        relatedTo: project._id,
        onModel: 'Review',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
    });
    await activity.save();

    res.status(201).json(createdReview);
});

// @desc Update a review
// @route PATCH /reviews/:id
// @access Private
const updateReview = asyncHandler(async (req, res) => {
    const { feedback, decision } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }

    if (feedback) review.reviewer.forEach(r => r.feedback = feedback);
    if (decision) review.reviewer.forEach(r => r.decision = decision);

    const updatedReview = await review.save();

    const activity = new Activity({
        actionType: 'Updated',
        description: `Updated review was created with ID ${review._id}`,
        createdBy: req.user._id,
        relatedTo: project._id,
        onModel: 'Review',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
    });
    await activity.save();

    res.json(updatedReview);
});

// @desc Delete a review
// @route DELETE /reviews/:id
// @access Private
const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }

    const result = await review.deleteOne()

    const reply = `Review with ID ${result._id} deleted`

    const activity = new Activity({
        actionType: 'Deleted',
        description: `Review with ID ${review._id} was deleted`,
        createdBy: req.user._id,
        relatedTo: project._id,
        onModel: 'Review',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
    });
    await activity.save();

    res.json(reply)
});

const updateRevisionNumber = (item, isMajor) => {
    console.log(`Original revision number: ${item.revisionNumber}`);


    const revisionRegex = /^([A-Z]*)\.?(\d+)(\.(\d+))?$/;
    const match = item.revisionNumber.match(revisionRegex);

    if (!match) {
        console.error("Incorrect format for revision number:", item.revisionNumber);
        return null;
    }

    let [, prefix, major, , minor] = match;
    console.log(`Parsed values - Prefix: ${prefix}, Major: ${major}, Minor: ${minor || 'none'}`);

    major = parseInt(major, 10);
    minor = minor ? parseInt(minor, 10) : 0;

    if (isMajor) {
        console.log("Processing a major update...");

        if (prefix) {
            // Increment the letter prefix if present, assume only single-letter prefix for simplicity
            prefix = String.fromCharCode(prefix.charCodeAt(0) + 1);
            console.log(`Incremented letter prefix to: ${prefix}`);
        } else {
            // Increment major number if no prefix is present
            major++;
            console.log(`Incremented major number to: ${major}`);
        }
        minor = 1; // Reset minor number to 1 for major updates
        console.log(`Reset minor number to: ${minor}`);
    } else {
        console.log("Processing a minor update...");
        minor++; // Simply increment the minor number for minor updates
        console.log(`Incremented minor number to: ${minor}`);
    }

    const newRevisionNumber = prefix ? `${prefix}${major}.${minor}` : `${major}.${minor}`;
    console.log(`Updating revision from ${item.revisionNumber} to ${newRevisionNumber}`);

    return newRevisionNumber;
};

const updateItem = async (itemId, model, isMajor, changeRequestId, user) => {
    console.log(`Looking up item ${itemId} in model ${model.modelName}`);
    const item = await model.findById(itemId);
    if (!item) {
        console.log(`Item ${itemId} not found in model ${model.modelName}`);
        return;
    }

    // Generate new revision number
    const newRevisionNumber = updateRevisionNumber(item, isMajor);
    if (newRevisionNumber) {
        // Create and save the activity
        const activity = new Activity({
            actionType: 'RevisionUpdate',
            description: `Revision updated to ${newRevisionNumber}`,
            relatedTo: itemId,
            onModel: model.modelName,
            ipAddress: req.ip,
            deviceInfo: req.headers['user-agent']
        });
        await activity.save();

        // Prepare revision data
        const revision = {
            revisionNumber: newRevisionNumber,
            description: 'Updated based on change request.',
            author: user,  
            date: new Date(),  
            changeRequestId: changeRequestId  
        };

        // Update item with new revision and status
        console.log(`Updating item ${itemId}: setting status to 'Checked In' and adding new revision`);
        await model.findByIdAndUpdate(itemId, {
            $set: { status: 'Checked In' },
            $push: { revisions: revision }  
        }, { new: true });
    }
};

const processUpdates = async (items, model,isMajor) => {


    console.log(`Processing updates for ${items.length} items in model ${model.modelName}`);
    for (let itemId of items) {
        await updateItem(itemId, model,isMajor);
    }
};

const updateRelatedItemsAndMain = async (changeRequest, user) => {
    const isMajor = changeRequest.revisionType === 'Major';
    console.log(`Updating related items and main for ChangeRequest: ${changeRequest._id}, Major update: ${isMajor}`);

    // Update the main item
    const mainModel = models[changeRequest.onModel];
    console.log(`Model for main item: ${mainModel.modelName}`);
    if (mainModel) {
        await updateItem(changeRequest.mainItem, mainModel, isMajor, changeRequest._id, user);
    }

    // Process all related item types
    await processUpdates(changeRequest.relatedDocuments, models.Document, isMajor, changeRequest._id, user);
    await processUpdates(changeRequest.relatedDesigns, models.Design, isMajor, changeRequest._id, user);
    await processUpdates(changeRequest.relatedProducts, models.Product, isMajor, changeRequest._id, user);
};

const processRejectionWorkflow = async (review, req, res) => {
    review.status = 'Rejected';
    await review.save();

    const pendingReviewers = review.reviewers.filter(r => r.decision === 'Pending').map(r => r.userId);

    // Find all tasks that are going to be cancelled to log them properly
    const tasksToCancel = await Task.find({
        'assignedTo': { $in: pendingReviewers },
        'review': review._id,
        'status': { $ne: 'Cancelled' } 
    });

    // Now cancel all these tasks
    await Task.updateMany(
        { '_id': { $in: tasksToCancel.map(task => task._id) } },
        { $set: { 'status': 'Cancelled' } }
    );

    // Log an activity for each cancellation
    for (const task of tasksToCancel) {
        const activity = new Activity({
            actionType: 'Cancelled',
            description: `Task for review ${review._id} assigned to user ${task.assignedTo} was cancelled`,
            relatedTo: task._id,
            onModel: 'Task',
            ipAddress: req.ip,
            deviceInfo: req.headers['user-agent']
        });
        await activity.save();
    }

    console.log("Cancelled pending review tasks");
    
    const observeTask = await Task.findOne({
        'review': review._id, 
        'taskType': 'Observe'
    });

    if (observeTask) {
        observeTask.status = 'Completed';
        await observeTask.save();

        const activity = new Activity({
            actionType: 'Update',
            description: `Review Failed task: ${observeTask.id} updated to complete`,
            relatedTo: observeTask.id,
            onModel: 'Task',
            ipAddress: req.ip,
            deviceInfo: req.headers['user-agent']
        });
        await activity.save();

        console.log("Observer task completed");

        // Create a new 'Revise' task for the observer to handle necessary revisions
        const reviseTaskData = {
            projectId: observeTask.projectId,
            name: 'Revise item based on review feedback',
            description: 'Revise the item based on feedback and resubmit for review',
            status: 'In Progress',
            priority: observeTask.priority, 
            assignedTo: observeTask.assignedTo, 
            taskType: 'Revise',
            relatedTo: observeTask.relatedTo, 
            dueDate: observeTask.dueDate,
            review: review._id, 
            assignedChangeRequest: observeTask?.assignedChangeRequest, 
            assignedDesign: observeTask?.assignedDesign,
            assignedDocument: observeTask?.assignedDocument,
            assignedProduct: observeTask?.assignedProduct
        };

        const newReviseTask = new Task(reviseTaskData);
        await newReviseTask.save();

        const activityNew = new Activity({
            actionType: 'Created',
            description: `Created task: ${observeTask.id}`,
            relatedTo: newReviseTask.id,
            onModel: 'Task',
            ipAddress: req.ip,
            deviceInfo: req.headers['user-agent']
        });
        await activityNew.save();

        console.log("Created new 'Revise' task for the observer");
    }

    res.status(200).json({ message: 'Review rejected, pending tasks cancelled, and revise task created' });
};

const handleChangeRequestApproval = async (review) => {
    try {
        const changeRequest = await ChangeRequest.findById(review.itemReviewed);
        if (!changeRequest) {
            console.log("Change request not found");
            return { success: false, message: "Change request not found" };
        }
        // Update the change request status
        changeRequest.status = 'Approved';

        const approvalActivity = new Activity({
            actionType: 'Approved',
            description: `Change request ${changeRequest._id} for project ${changeRequest.projectId} was approved.`,
            relatedTo: changeRequest._id,
            onModel: 'ChangeRequest',
            ipAddress: req.ip,
            deviceInfo: req.headers['user-agent']
        });
        await approvalActivity.save();

        await changeRequest.save();

        // Create the update task
        const updateTask = new Task({
            projectId: changeRequest.projectId,
            name: 'Update main item in change request',
            description: 'Update the main item to match the changes described within the change request as well as any other related items.',
            status: 'In Progress',
            priority: changeRequest.priority,
            assignedTo: changeRequest.assignedTo,
            taskType: 'Update',
            relatedTo: changeRequest.onModel,
            dueDate: changeRequest.estimatedCompletionDate,
            assignedChangeRequest: changeRequest._id
        });

        await updateTask.save();

        const taskCreationActivity = new Activity({
            actionType: 'Created',
            description: `Update task created for change request ${changeRequest._id} with task ID ${updateTask._id}. Task is to update the main item and any related items as described in the change request.`,
            relatedTo: updateTask._id,
            onModel: 'Task',
            ipAddress: req.ip,
            deviceInfo: req.headers['user-agent']
        });
        await taskCreationActivity.save();

        console.log("Saved update task");

        return { success: true, message: "Change request approved and update task created" };
    } catch (error) {
        console.error("Error processing change request approval:", error);
        return { success: false, message: error.message };
    }
}; 

const processCompletionWorkflow = async (review, req, res) => {
    const allReviewed = review.reviewers.every(r => r.decision !== 'Pending');
    if (allReviewed) {
        console.log("All reviewers have completed their review, updating review status");
        review.status = 'Completed';

        const reviewCompletionActivity = new Activity({
            actionType: 'Completed',
            description: `Review ${review._id} completed. All reviewers have submitted their decisions.`,
            relatedTo: review._id,
            onModel: 'Review',
            ipAddress: req.ip,
            deviceInfo: req.headers['user-agent']
        });
        await reviewCompletionActivity.save();

        await review.save();

        // Update observer task to 'Completed'
        const observeTask = await Task.findOne({
            'review': review._id, 
            'taskType': 'Observe'
        });

        if (observeTask) {

            const taskCompletionActivity = new Activity({
                actionType: 'Completed',
                description: `Observer task ${observeTask._id} associated with review ${review._id} marked as completed.`,
                createdBy: observeTask.assignedTo, // This should be the ID of the user marking the task completed
                relatedTo: observeTask._id,
                onModel: 'Task',
                ipAddress: req.ip,
                deviceInfo: req.headers['user-agent']
            });
            await taskCompletionActivity.save();

            observeTask.status = 'Completed';
            await observeTask.save();
        }

        const Model = models[review.onModel];
        if (review.onModel === 'ChangeRequest') {
            const result = await handleChangeRequestApproval(review);
            console.log(result.message);
        }else  if (review.reviewType === 'Update') {
            const changeRequest = await models.ChangeRequest.findById(observeTask.assignedChangeRequest);
            if (changeRequest) {
                console.log("Updating related items and main item for change request");
                await updateRelatedItemsAndMain(changeRequest);

                const updateTask = await Task.findOne({
                    'assignedTo': observeTask.assignedTo,
                    'relatedTo': observeTask.relatedTo,
                    'assignedChangeRequest': changeRequest._id,
                    'taskType': 'Update'
                });
                if (updateTask) {

                    const updateTaskCompletionActivity = new Activity({
                        actionType: 'Completed',
                        description: `Update task ${updateTask._id} related to change request ${changeRequest._id} and observer task ${observeTask._id} marked as completed.`,
                        relatedTo: updateTask._id,
                        onModel: 'Task',
                        ipAddress: req.ip,
                        deviceInfo: req.headers['user-agent']
                    });
                    await updateTaskCompletionActivity.save();

                    updateTask.status = 'Completed';
                    await updateTask.save();
                    console.log("Updated 'Update' task to Completed");
                }
            }
            console.log(changeRequest)
            changeRequest.status = 'Implemented';

            const changeRequestUpdateActivity = new Activity({
                actionType: 'Implemented',
                description: `Change request ${changeRequest._id} status updated to Implemented.`,
                relatedTo: changeRequest._id,
                onModel: 'ChangeRequest',
                ipAddress: req.ip,
                deviceInfo: req.headers['user-agent']
            });
            await changeRequestUpdateActivity.save();

            await changeRequest.save();
        } else if (Model) {
            console.log("Updating item status to Checked In");
            await Model.findByIdAndUpdate(review.itemReviewed, { status: 'Checked In' });

            const createTask = await Task.findOne({
                'assignedTo': observeTask.assignedTo,
                'relatedTo': observeTask.relatedTo,
                'taskType': 'Create'
            });
            if (createTask) {
                createTask.status = 'Completed';

                const createTaskCompletionActivity = new Activity({
                    actionType: 'Completed',
                    description: `Create task ${createTask._id} related to observer task ${observeTask._id} marked as completed.`,
                    relatedTo: createTask._id,
                    onModel: 'Task',
                    ipAddress: req.ip,
                    deviceInfo: req.headers['user-agent']
                });
                await createTaskCompletionActivity.save();

                await createTask.save();
                console.log("Updated 'Create' task to Completed");
            }
        }
        res.json({ review, message: 'Review completed successfully' });
    } else {
        console.log("Not all reviewers have completed their review");
        res.json(review);
    }
};
// @desc Submit a review by a reviewer
// @route PATCH /reviews/:id/submit
// @access Private
const reviewSubmission = asyncHandler(async (req, res) => {
    const { reviewerId, feedback, decision } = req.body;
    console.log("Starting review submission process");
    const review = await Review.findById(req.params.id);

    if (!review) {
        console.log("Review not found:", req.params.id);
        return res.status(404).json({ message: 'Review not found' });
    }

    console.log("Review found, processing feedback and decisions");
    const reviewerIndex = review.reviewers.findIndex(r => r.userId.toString() === reviewerId);
    if (reviewerIndex === -1) {
        console.log("Reviewer not found:", reviewerId);
        return res.status(404).json({ message: 'Reviewer not found in this review' });
    }

    review.reviewers[reviewerIndex].feedback = feedback;
    review.reviewers[reviewerIndex].decision = decision;

    const reviewUpdateActivity = new Activity({
        actionType: 'Updated',
        description: `Review ${review._id} updated by reviewer ${reviewerId}: Decision - ${decision}, Feedback - ${feedback}`,
        createdBy: req.user._id,
        relatedTo: review._id,
        onModel: 'Review',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
    });
    await reviewUpdateActivity.save();

    await review.save();
    console.log("Updated review with feedback and decision:", feedback, decision);

     // Find the task and update its status to 'Completed'
    const reviewerTask = await Task.findOne({
        'assignedTo': reviewerId,
        'review': review._id
    });

    if (reviewerTask && reviewerTask.status !== 'Completed') {
        reviewerTask.status = 'Completed';
        await reviewerTask.save();

        const taskCompletionActivity = new Activity({
            actionType: 'Completed',
            description: `Task ${reviewerTask._id} for review ${review._id} completed by reviewer ${reviewerId}`,
            createdBy: req.user._id, 
            relatedTo: reviewerTask._id,
            onModel: 'Task',
            ipAddress: req.ip,
            deviceInfo: req.headers['user-agent']
        });
        await taskCompletionActivity.save();

        console.log("Logged activity for reviewer's task completion.");
    }

    if (decision === 'Rejected') {
        console.log("Decision is rejected, processing rejection workflow");
        processRejectionWorkflow(review, req, res);
    } else {
        console.log("Processing completion of review if all decisions made");
        processCompletionWorkflow(review, req, res);
    }
});

// @desc Get reviews by itemReviewed
// @route GET /reviews/item/:itemReviewed
// @access Private
const getReviewsByItemReviewed = asyncHandler(async (req, res) => {
    const { itemReviewed } = req.params;
    const reviews = await Review.find({ itemReviewed }).populate({
        path: 'reviewers.userId',
        select: 'firstName surname'
    }).lean();

    if (!reviews.length) {
        return res.status(404).json({ message: 'No reviews found for the specified item' });
    }

    res.json(reviews);
});

module.exports = {
    getAllReviews,
    getReviewById,
    createNewReview,
    updateReview,
    deleteReview,
    reviewSubmission,
    getReviewsByItemReviewed
};
  