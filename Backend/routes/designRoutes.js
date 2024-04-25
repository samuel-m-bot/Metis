const express = require('express')
const router = express.Router()
const designController = require('../controllers/designsController')
const upload = require('../config/multerConfig');

//@desc Routes for Design


router.route('/')
    .get(designController.getAllDesigns)
    .post(upload.single('designImage'), designController.createNewDesign); 

router.route('/:id')
    .get(designController.getDesignById)
    .patch(upload.single('designImage'), designController.updateDesign) 
    .delete(designController.deleteDesign);
    
router.get('/download/:id', designController.downloadDesignFile);
router.get('/project/:projectId', designController.getDesignsByProjectId);
router.patch('/:id/toggle-featured', designController.toggleFeaturedDesign);


module.exports = router