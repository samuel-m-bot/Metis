const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documentsController');
const { upload, uploadFileToStorage } = require('../config/multerConfig');  

router.route('/')
    .get(documentsController.getAllDocuments)
    .post(upload.single('documentFile'), async (req, res, next) => {
        if (req.file) {
            try {
                const fileUrl = await uploadFileToStorage(req.file);
                req.fileUrl = fileUrl;  // Attach the URL to the request object to be used in the next middleware
                next();  // Proceed to create the new document
            } catch (error) {
                res.status(500).json({ message: 'Failed to upload file', error: error.message });
            }
        } else {
            next();  // No file to upload, proceed to create the document
        }
    }, documentsController.createNewDocument);

    router.route('/:id')
    .get(documentsController.getDocumentById)
    .patch(upload.single('documentFile'), async (req, res, next) => {
        if (req.file) {
            try {
                const fileUrl = await uploadFileToStorage(req.file);
                req.fileUrl = fileUrl;  // Attach the URL to the request object to be used in the next middleware
                next();  // Proceed to update the document
            } catch (error) {
                res.status(500).json({ message: 'Failed to upload file', error: error.message });
            }
        } else {
            next();  // No file to upload, proceed to update the document
        }
    }, documentsController.updateDocument)
    .delete(documentsController.deleteDocument);

router.get('/download/:id', documentsController.downloadDocumentFile);
router.get('/project/:projectId', documentsController.getDocumentsByProjectId);

module.exports = router;
