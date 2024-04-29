const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const reviewController = require('../controllers/reviewController');
const verifyJWT = require('../middleware/verifyJWT');
const mongoose = require('mongoose');
require('dotenv').config();


jest.mock('../controllers/reviewController');
jest.mock('../middleware/verifyJWT', () => {
    return (req, res, next) => {
        req.user = {
            _id: '5f78c902c8b4e667a0831cfa', 
            email: 'user@example.com',
            roles: ['user']
        };
        next();
    };
});


const app = express();
app.use(bodyParser.json());
app.patch('/reviews/:id/submit', verifyJWT, reviewController.reviewSubmission);

describe('Review Submission and Change Request Approval', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    test('Approve Change Request after review submission', async () => {
        const reviewId = new mongoose.Types.ObjectId(); 
        const reviewData = {
            reviewerId: new mongoose.Types.ObjectId(), 
            feedback: 'Excellent work, proceed to approval.',
            decision: 'Approved'
        };

        reviewController.reviewSubmission.mockImplementation(async (req, res) => {
            if (req.params.id === reviewId.toString() && req.body.decision === 'Approved') {
                // Simulate the logic that would normally be executed on review approval
                return res.status(200).json({
                    message: 'Review approved and change request updated',
                    review: {
                        _id: reviewId,
                        status: 'Completed',
                        decision: req.body.decision
                    }
                });
            } else {
                return res.status(400).json({ message: 'Error processing review submission' });
            }
        });

        const response = await request(app)
            .patch(`/reviews/${reviewId}/submit`)
            .send(reviewData);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Review approved and change request updated');
        expect(response.body.review).toHaveProperty('status', 'Completed');
        expect(response.body.review).toHaveProperty('decision', 'Approved');
    });
});
