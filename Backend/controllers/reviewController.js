const Review = require('../models/Review');
const Task = require('../models//Tasks')
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

const processUpdates = async (items, model) => {
    console.log(`Processing updates for ${items.length} items in model ${model.modelName}`);
    for (let itemId of items) {
        await updateItem(itemId, model);
    }
};

const updateRelatedItemsAndMain = async (changeRequest) => {
    const isMajor = changeRequest.revisionType === 'Major';
    console.log(`Updating related items and main for ChangeRequest: ${changeRequest._id}, Major update: ${isMajor}`);

    const updateItem = async (itemId, model) => {
        console.log(`Looking up item ${itemId} in model ${model.modelName}`);
        const item = await model.findById(itemId);
        if (!item) {
            console.log(`Item ${itemId} not found in model ${model.modelName}`);
            return;
        }

        const newRevisionNumber = updateRevisionNumber(item, isMajor);
        if (newRevisionNumber) {
            console.log(`Updating item ${itemId}: setting status to 'Checked In' and revision number to ${newRevisionNumber}`);
            await model.findByIdAndUpdate(itemId, {
                status: 'Checked In',
                revisionNumber: newRevisionNumber
            }, { new: true });
        }
    };

    // Update the main item
    const mainModel = models[changeRequest.onModel];
    console.log(`Model for main item: ${mainModel.modelName}`);
    if (mainModel) {
        await updateItem(changeRequest.mainItem, mainModel);
    }

    // Process all related item types
    await processUpdates(changeRequest.relatedDocuments, models.Document);
    await processUpdates(changeRequest.relatedDesigns, models.Design);
    await processUpdates(changeRequest.relatedProducts, models.Product);
};

const processRejectionWorkflow = async (review, req, res) => {
    review.status = 'Rejected';
    await review.save();

    // Cancel all pending review tasks
    const pendingReviewers = review.reviewers.filter(r => r.decision === 'Pending').map(r => r.userId);
    await Task.updateMany(
        { 'assignedTo': { $in: pendingReviewers }, 'review': review._id },
        { $set: { 'status': 'Cancelled' } }
    );

    console.log("Cancelled pending review tasks");
    
    const observeTask = await Task.findOne({
        'review': review._id, 
        'taskType': 'Observe'
    });

    if (observeTask) {
        observeTask.status = 'Completed';
        await observeTask.save();
        console.log("Observer task completed");

        // Create a new 'Revise' task for the observer to handle necessary revisions
        const reviseTaskData = {
            projectId: observeTask.projectId,
            name: 'Revise item based on review feedback',
            description: 'Revise the item based on feedback and resubmit for review',
            status: 'To Do',
            priority: observeTask.priority, // Assuming same priority as the observe task
            assignedTo: observeTask.assignedTo, // Assigning to the same person who observed
            taskType: 'Revise',
            relatedTo: observeTask.relatedTo, // Related to the same item type as the observe task
            dueDate: observeTask.dueDate,
            review: review._id, // Linking back to the original review for reference
            assignedChangeRequest: observeTask?.assignedChangeRequest // Assuming it's related to a change request
        };

        const newReviseTask = new Task(reviseTaskData);
        await newReviseTask.save();
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
        await review.save();

        // Update observer task to 'Completed'
        const observeTask = await Task.findOne({
            'review': review._id, 
            'taskType': 'Observe'
        });

        if (observeTask) {
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
                    updateTask.status = 'Completed';
                    await updateTask.save();
                    console.log("Updated 'Update' task to Completed");
                }
            }
            changeRequest.status = 'Implemented';
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
    await review.save();
    console.log("Updated review with feedback and decision:", feedback, decision);

     // Update the reviewer's task to 'Completed'
     await Task.findOneAndUpdate(
        { 'assignedTo': reviewerId, 'review': review._id },
        { $set: { 'status': 'Completed' } }
    );

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
  