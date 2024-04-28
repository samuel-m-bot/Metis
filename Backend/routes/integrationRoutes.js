const express = require('express')
const router = express.Router()
const integrationController = require('../controllers/integrationController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.get('/salesforce/contacts', integrationController.fetchSalesforceContacts);

module.exports = router