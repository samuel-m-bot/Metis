const Review = require('../models/Review');
const Task = require('../models/Tasks')
const asyncHandler = require('express-async-handler');

const models = {
    Document: require('../models/Document'),
    Design: require('../models/Design'),
    Product: require('../models/Product')
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

// @desc Get specific review
// @route GET /reviews/:id
// @access Private
const getReviewById = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        return res.status(404).json({ message: 'No review found with that ID' });
    }
    res.json(review);
});

// @desc Create new review
// @route POST /reviews
// @access Private
const createNewReview = asyncHandler(async (req, res) => {
    const { itemReviewed, onModel, reviewers } = req.body;
    if (!itemReviewed || !onModel || !reviewers) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const review = new Review({ itemReviewed, onModel, reviewers });
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

// @desc Submit a review by a reviewer
// @route PATCH /reviews/:id/submit
// @access Private
const reviewSubmission = asyncHandler(async (req, res) => {
    const { reviewerId, feedback, decision } = req.body;
    const review = await Review.findById(req.params.id);

    console.log(review)
    console.log(reviewerId)
    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }

    // Find and update the specific reviewer's feedback and decision
    const reviewerIndex = review.reviewers.findIndex(r => r.userId.toString() === reviewerId);
    if (reviewerIndex === -1) {
        return res.status(404).json({ message: 'Reviewer not found in this review' });
    }

    review.reviewers[reviewerIndex].feedback = feedback;
    review.reviewers[reviewerIndex].decision = decision;

    // Update the reviewer's task to 'Completed'
    await Task.findOneAndUpdate(
        { 'assignedTo': reviewerId, 'review': review._id },
        { $set: { 'status': 'Completed' } }
    );

    // Immediately reject the review if any reviewer rejects it
    if (decision === 'Rejected') {
        review.status = 'Rejected';
    
        await review.save();

        // Cancel tasks for all reviewers who have not yet completed their reviews
        const pendingReviewers = review.reviewers.filter(r => r.decision === 'Pending').map(r => r.userId);
        await Task.updateMany(
            { 'assignedTo': { $in: pendingReviewers }, 'review': review._id },
            { $set: { 'status': 'Cancelled' } }
        );

        // Also, find and update the observer task to 'Completed'
        const observeTask = await Task.findOne({
            'review': review._id, 
            'taskType': 'Observe'
        });

        if (observeTask) {
            observeTask.status = 'Completed';
            await observeTask.save();
    
            // Create a new task for revision based on feedback
        const reviseTaskData = {
            projectId: observeTask.projectId,
            name: 'Revise item to answer feedbacks',
            description: 'The item has been rejected by a reviewer. Please revise the item to meet the given feedback.',
            status: 'Not Started', 
            priority: observeTask.priority,
            assignedTo: observeTask.assignedTo,
            taskType: 'Revise', 
            relatedTo: observeTask.relatedTo,
            dueDate: observeTask.dueDate || undefined,
            review: review._id 
        };

        // Dynamically setting the assigned field based on the relatedTo value
        switch(observeTask.relatedTo) {
            case 'Document':
                reviseTaskData.assignedDocument = observeTask.assignedDocument;
                break;
            case 'Design':
                reviseTaskData.assignedDesign = observeTask.assignedDesign;
                break;
            case 'Product':
                reviseTaskData.assignedProduct = observeTask.assignedProduct;
                break;
            default:
                
                console.error('Unexpected relatedTo value:', observeTask.relatedTo);
                return res.status(400).json({ message: 'Invalid relatedTo field value' });
        }
    
            const newTask = new Task(reviseTaskData);
            await newTask.save();
        }

        res.status(200).json({ message: 'Review rejected and pending tasks cancelled' });
    } else {
        // Check if all reviewers have made a decision and update review status
        const allReviewed = review.reviewers.every(r => r.decision !== 'Pending');
        if (allReviewed) {
            review.status = 'Completed'; 
            
            const Model = models[review.onModel]; // Dynamically select the model
            if (Model) {
                await Model.findByIdAndUpdate(review.itemReviewed, { status: 'Checked In' });
            }

            await review.save();
    
            // Also, find and update the observer task to 'Completed'
            const observeTask = await Task.findOne({
                'review': review._id, 
                'taskType': 'Observe'
            });
    
            if (observeTask) {
                observeTask.status = 'Completed';
                await observeTask.save();
            }
    
            res.json({review, observeTask: observeTask ? observeTask : 'No observe task found'});
        } else {
            await review.save();
            res.json(review);
        }
    }    
});

module.exports = {
    getAllReviews,
    getReviewById,
    createNewReview,
    updateReview,
    deleteReview,
    reviewSubmission
};