const express = require('express');
const router = express.Router();
const designController = require('../controllers/designsController');
const { upload, uploadFileToStorage } = require('../config/multerConfig');

// Middleware to handle file upload and attach URL to req.body
async function handleFileUpload(req, res, next) {
    if (req.file) {
        try {
            const fileUrl = await uploadFileToStorage(req.file);
            req.body.attachment = {
                filePath: fileUrl,
                fileName: req.file.originalname
            };
            next();
        } catch (error) {
            res.status(500).json({ message: 'Failed to upload file', error: error.message });
        }
    } else {
        next();
    }
}

router.route('/')
    .get(designController.getAllDesigns)
    .post(upload.single('designImage'), handleFileUpload, designController.createNewDesign);

router.route('/:id')
    .get(designController.getDesignById)
    .patch(upload.single('designImage'), handleFileUpload, designController.updateDesign) 
    .delete(designController.deleteDesign);

router.get('/download/:id', designController.downloadDesignFile);
router.get('/project/:projectId', designController.getDesignsByProjectId);
router.patch('/:id/toggle-featured', designController.toggleFeaturedDesign);

module.exports = router;