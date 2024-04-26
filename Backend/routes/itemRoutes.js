const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

// Route to check if a user can check out or check in an item
router.get('/:itemId/can-check-out/:userId/:projectId', itemController.canUserCheckOutAndInItem);

// Assuming itemType is necessary to determine the model
router.post('/:itemId/:itemType/check-out/:userId', itemController.checkOutItem);

// Route to handle the check-in of an item
router.post('/:itemId/:itemType/check-in/:userId', itemController.checkInItem);

module.exports = router;
