const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const authController = require('../controllers/authController');
const loginLimiter = require('../middleware/loginLimiter');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.post('/login', loginLimiter, authController.login);

describe('Auth Controller - Login', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }, 20000); // Increase timeout for beforeAll to 20 seconds

    afterAll(async () => {
        if (mongoose.connection) {
            await mongoose.disconnect();
        }
        if (mongoServer) {
            await mongoServer.stop();
        }
    }, 20000); // Increase timeout for afterAll to 20 seconds

    beforeEach(async () => {
        // Clear all instances before each test
        await User.deleteMany({});
        
        // Create a mock user in the database with all required fields
        const passwordHash = await bcrypt.hash('testpassword', 10);
        await User.create({
            email: 'test@example.com',
            passwordHash,
            firstName: 'John',
            surname: 'Doe',
            department: 'Engineering'
        });
    });

    test('Successful login returns accessToken', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'test@example.com',
                password: 'testpassword'
            });
    
        if (response.statusCode !== 200) {
            console.log(response.body);  // Log the error message from the server
        }
    
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
    });
    

    test('Failed login with incorrect password returns 401', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized - Incorrect information');
    });
});