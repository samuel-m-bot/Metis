const express = require('express')
const router = express.Router()
const productController = require('../controllers/productsController')

//@desc Routes for Product


router.route('/')
    .get(productController.getAllProducts)
    .post(productController.createNewProduct)


router.route('/:id')
    .get(productController.getProductById)
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct)
module.exports = router