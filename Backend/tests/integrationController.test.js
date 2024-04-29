const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const integrationController = require('../controllers/integrationController');
const verifyJWT = require('../middleware/verifyJWT');
require('dotenv').config();

jest.mock('axios');
jest.mock('../middleware/verifyJWT');

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
    console.log.mockRestore();
    console.error.mockRestore();
});

// Setup express app
const app = express();
app.use(bodyParser.json());
app.get('/integrations/salesforce/contacts', verifyJWT, integrationController.fetchSalesforceContacts);

describe('Salesforce Integration', () => {
    beforeEach(() => {
        // Mock the JWT middleware to always authenticate
        verifyJWT.mockImplementation((req, res, next) => {
            req.session = { accessToken: 'fake-access-token' };  // Simulate a session with an access token
            next();
        });
    });

    test('It should fetch contacts from Salesforce', async () => {
        const contacts = [
            { Id: '1', FirstName: 'John', LastName: 'Doe', Email: 'john.doe@example.com', Account: { Name: 'Acme Corp' }, Title: 'CEO' }
        ];

        axios.get.mockResolvedValue({
            data: {
                records: contacts
            }
        });

        const response = await request(app)
            .get('/integrations/salesforce/contacts');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(contacts);
        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('https://EU45.salesforce.com/services/data/v60.0/query'),
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Bearer fake-access-token'
                })
            })
        );
    });

    test('It should handle the case where no contacts are found', async () => {
        axios.get.mockResolvedValue({
            data: {
                records: []
            }
        });

        const response = await request(app)
            .get('/integrations/salesforce/contacts');

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: 'No contacts found' });
    });

    test('It should handle errors when fetching contacts from Salesforce', async () => {
        axios.get.mockRejectedValue(new Error('Failed to fetch contacts'));

        const response = await request(app)
            .get('/integrations/salesforce/contacts');

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ message: 'Failed to fetch contacts from Salesforce' });
    });
});
