const express = require('express')
const router = express.Router()
const changeRequestController = require('../controllers/changeRequestsController')

// Routes for managing change requests (CR)
router.route('/')
    .get(changeRequestController.getAllChangeRequests)
    .post(changeRequestController.createNewChangeRequest)


router.route('/:id')
    .get(changeRequestController.getChangeRequestById)
    .patch(changeRequestController.updateChangeRequest)
    .delete(changeRequestController.deleteChangeRequest)

// Additional project-specific routes
router.get('/status/:status', changeRequestController.listChangeRequestsByStatus); // Queys list of CR by status
router.get('/:id/assign', changeRequestController.assignChangeRequest); // Assign CR to a user
router.get('/:id/approveReject', changeRequestController.approveRejectChangeRequest); // Approving or rejecting a CR
router.get('/project/:projectId/:status', changeRequestController.getChangeRequestsByProjectAndStatus);
// router.get('/:type/:itemId', changeRequestController.getChangeRequestsByRelatedItem);
router.get('/main-item/:mainItemId', changeRequestController.getChangeRequestsByMainItem); // Get all change requests for a mainItem
router.post('/:id/comment', changeRequestController.addCommentToChangeRequest);
router.delete('/:id/comment/:commentId', changeRequestController.deleteCommentFromChangeRequest);
router.get('/:id/comments', changeRequestController.getCommentsForChangeRequest);


module.exports = router