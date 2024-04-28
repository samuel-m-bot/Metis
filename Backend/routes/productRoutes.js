const express = require('express');
const router = express.Router();
const productController = require('../controllers/productsController');
const verifyJWT = require('../middleware/verifyJWT');

// Middleware to verify JWT on all routes in this router
router.use(verifyJWT);

router.route('/')
    .get(productController.getAllProducts)
    .post(productController.createNewProduct);

router.route('/:id')
    .get(productController.getProductById)
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct);

// Route to get products by project ID
router.get('/project/:projectId', productController.getProductsByProjectId);

// Route to fetch the Salesforce product performance report
router.get('/analytics/product-performance', productController.fetchProductPerformanceReport);

module.exports = router;
