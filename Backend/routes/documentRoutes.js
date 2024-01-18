const express = require('express')
const router = express.Router()
const documentController = require('../controllers/documentsController')

//@desc Routes for Document


router.route('/')
    .get(documentController.getAllDocuments)
    .post(documentController.createNewDocument)


router.route('/:id')
    .get(documentController.getDocumentById)
    .patch(documentController.updateDocument)
    .delete(documentController.deleteDocument)
module.exports = router