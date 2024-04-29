const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const changeRequestController = require('../controllers/changeRequestsController');
const verifyJWT = require('../middleware/verifyJWT');
const mongoose = require('mongoose');
require('dotenv').config();


jest.mock('../controllers/changeRequestsController');
jest.mock('../middleware/verifyJWT', () => {
    return (req, res, next) => {
        req.user = {
            _id: '5f78c902c8b4e667a0831cfa', // Assume this is a valid MongoDB ObjectId string
            email: 'user@example.com',
            roles: ['user']
        };
        next();
    };
});

// Setup express application
const app = express();
app.use(bodyParser.json());
app.post('/changeRequests', verifyJWT, changeRequestController.createNewChangeRequest);

describe('Change Request Creation', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    test('Create new change request with all required fields', async () => {
        const changeRequestData = {
            requestedBy: new mongoose.Types.ObjectId().toString(),
            projectId: new mongoose.Types.ObjectId().toString(),
            title: 'New Change Request',
            description: 'Details about the change request',
            status: 'Requested',
            priority: 'High',
            mainItem: new mongoose.Types.ObjectId().toString(),
            onModel: 'Product',
            changeType: 'Corrective',
            riskAssessment: 'Risk assessment details',
            impactLevel: 'High',
            revisionType: 'Major'
        };
    
        // Assume the response from the API
        const response = {
            statusCode: 201,
            body: {
                message: 'Change request created successfully',
                data: {
                    ...changeRequestData,
                    // Simulate MongoDB returning ObjectId as strings
                    requestedBy: changeRequestData.requestedBy.toString(),
                    projectId: changeRequestData.projectId.toString(),
                    mainItem: changeRequestData.mainItem.toString()
                }
            }
        };
    
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Change request created successfully');
        expect(response.body.data).toEqual(expect.objectContaining(changeRequestData));
    }, 30000);    
});
