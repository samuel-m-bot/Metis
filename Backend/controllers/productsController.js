const Product = require('../models/Product')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all products
// @route GET /products
// @access private
const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().lean()
    res.json(products)
})

// @desc Get specific products
// @route GET /products
// @access private
const getProductById = asyncHandler(async (req, res) => {
    const products = await Product.findById(req.params.id).lean()
    if(!products){
        return res.status(400).json({ message: 'No product found with that ID'})
    }
    res.json(products)
})

// @desc Create a new product
// @route POST /products
// @access private
const createNewProduct = asyncHandler(async (req, res) => {
    const {
        name, description, category, lifecycleStatus, type,
        physicalAttributes, digitalAttributes
    } = req.body

    // Confirm mandatory data is provided
    if (!name || !description || !category || !lifecycleStatus || !type) {
        return res.status(400).json({ message: 'All required fields are not provided' })
    }

    // Check for duplicate products by name
    const duplicate = await Product.findOne({ name }).lean().exec()
    if (duplicate) {
        return res.status(400).json({ message: 'Duplicate product name' })
    }

    // Create new product object
    const productObject = {
        name, description, category, lifecycleStatus, type,
        physicalAttributes, digitalAttributes
    }

    // Create and store new product
    const product = await Product.create(productObject)

    if (product) {
        res.status(201).json({ message: `New product ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid product data received' })
    }
})

// @desc Update a product
// @route PATCH /products
// @access private
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return res.status(400).json({ message: 'Product not found' })
    }

    // If name needs to be updated, check for duplicates
    if (req.body.name && req.body.name !== product.name) {
        const duplicate = await Product.findOne({ name: req.body.name })
        if (duplicate) {
            return res.status(400).json({ message: 'Duplicate product name' })
        }
    }

    // Update fields if provided
    product.name = req.body.name || product.name
    product.description = req.body.description || product.description
    product.category = req.body.category || product.category
    product.lifecycleStatus = req.body.lifecycleStatus || product.lifecycleStatus
    product.type = req.body.type || product.type
    product.physicalAttributes = req.body.physicalAttributes || product.physicalAttributes
    product.digitalAttributes = req.body.digitalAttributes || product.digitalAttributes

    // Handle updates to related entities if provided
    if (req.body.documents) {
        product.documents = req.body.documents
    }
    if (req.body.changeRequests) {
        product.changeRequests = req.body.changeRequests
    }

    // Save the updated product
    const updatedProduct = await product.save()

    res.json({ message: `Product ${updatedProduct.name} updated` })
})

// @desc Delete a product
// @route DELETE /products
// @access private
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const result = await product.deleteOne()

    const reply = `Product ${result.name} with ID ${result._id} deleted`

    res.json(reply)
})

// @desc List products by category
// @route GET /products/category/:categoryName
// @access private
const listProductsByCategory = asyncHandler(async (req, res) => {
    const { categoryName } = req.params;

    // Find products by category
    const products = await Product.find({ category: categoryName });

    if (!products.length) {
        return res.status(404).json({ message: `No products found in category ${categoryName}` });
    }

    res.json(products);
});


//Search Product

//Link Product To Project

//Update Product Status
module.exports = {
    getAllProducts,
    getProductById,
    createNewProduct,
    updateProduct,
    deleteProduct
}