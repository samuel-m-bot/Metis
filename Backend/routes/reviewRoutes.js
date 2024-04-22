const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Routes for Reviews
router.route('/')
    .get(reviewController.getAllReviews) // Get all reviews
    .post(reviewController.createNewReview); // Create a new review

router.route('/:id')
    .get(reviewController.getReviewById) // Get a single review by ID
    .patch(reviewController.updateReview) // Update a review
    .delete(reviewController.deleteReview); // Delete a review

module.exports = router;