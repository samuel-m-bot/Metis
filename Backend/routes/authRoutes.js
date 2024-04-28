const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')

router.route('/')
    .post(loginLimiter, authController.login)

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

// Redirect to Salesforce for authentication
router.get('/salesforce', authController.redirectToSalesforce);

// Handle callback from Salesforce
router.get('/callback', authController.handleSalesforceCallback);

// Test endpoint to check the access token
router.get('/test/access-token', authController.checkAccessToken);

module.exports = router