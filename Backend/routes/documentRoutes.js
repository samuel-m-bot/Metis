const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documentsController');
const upload = require('../config/multerConfig');  

router.route('/')
    .get(documentsController.getAllDocuments)
    .post(upload.single('documentFile'), documentsController.createNewDocument);

router.route('/:id')
    .get(documentsController.getDocumentById)
    .patch(upload.single('documentFile'), documentsController.updateDocument)  
    .delete(documentsController.deleteDocument);

module.exports = router;
