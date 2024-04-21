const Review = require('../models/Review');
const asyncHandler = require('express-async-handler');

// @desc Get all reviews
// @route GET /reviews
// @access Private
const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find().populate('itemReviewed reviewer.userId');
    if (!reviews.length) {
        return res.status(404).json({ message: 'No reviews found' });
    }
    res.json(reviews);
});

// @desc Get specific review
// @route GET /reviews/:id
// @access Private
const getReviewById = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id).populate('itemReviewed reviewer.userId');
    if (!review) {
        return res.status(404).json({ message: 'No review found with that ID' });
    }
    res.json(review);
});

// @desc Create new review
// @route POST /reviews
// @access Private
const createNewReview = asyncHandler(async (req, res) => {
    const { itemReviewed, onModel, reviewer } = req.body;
    if (!itemReviewed || !onModel || !reviewer) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const review = new Review({ itemReviewed, onModel, reviewer });
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

    await review.remove();
    res.json({ message: 'Review deleted successfully' });
});

module.exports = {
    getAllReviews,
    getReviewById,
    createNewReview,
    updateReview,
    deleteReview
};