const Product = require('../models/Product')
const Activity = require('../models/Activity')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all products
// @route GET /products
// @access private
const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().populate({
        path: 'projectId', 
        select: 'name'       
    }).lean();

    if (!products.length) {
        return res.status(400).json({ message: 'No products found' });
    }
    res.json(products);
});


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
        projectId, name, description, category, lifecycleStatus, type,
        revisionNumber, physicalAttributes, digitalAttributes, classification, status
    } = req.body

    // Confirm mandatory data is provided
    if (!projectId ||!name || !description || !category || !lifecycleStatus || !type || !revisionNumber || !classification || !status) {
        return res.status(400).json({ message: 'All required fields are not provided' })
    }

    // Check for duplicate products by name
    const duplicate = await Product.findOne({ name }).lean().exec()
    if (duplicate) {
        return res.status(400).json({ message: 'Duplicate product name' })
    }

    // Create new product object
    const productObject = {
        projectId, name, description, category, lifecycleStatus, type,
        revisionNumber, physicalAttributes, digitalAttributes, classification, status
    }

    // Create and store new product
    const product = await Product.create(productObject)

    if (product) {

        const activity = new Activity({
            actionType: 'Created',
            description: `New product '${product.name}' was created with ID ${product._id}`,
            createdBy: req.user._id,
            relatedTo: product._id,
            onModel: 'Product',
            ipAddress: req.ip,
            deviceInfo: req.headers['user-agent']
        });
        await activity.save();

        res.status(201).json(product);
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
    product.revisionNumber = req.body.revisionNumber || product.revisionNumber
    product.physicalAttributes = req.body.physicalAttributes || product.physicalAttributes
    product.digitalAttributes = req.body.digitalAttributes || product.digitalAttributes
    product.classification = req.body.classification || product.classification
    product.status = req.body.status || product.status

    // Handle updates to related entities if provided
    if (req.body.documents) {
        product.documents = req.body.documents
    }
    if (req.body.changeRequests) {
        product.changeRequests = req.body.changeRequests
    }

    // Save the updated product
    const updatedProduct = await product.save()

    const activity = new Activity({
        actionType: 'Updated',
        description: `Product '${product.name}' was updated with ID ${product._id}`,
        createdBy: req.user._id,
        relatedTo: product._id,
        onModel: 'Product',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
    });
    await activity.save();

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

    const activity = new Activity({
        actionType: 'Deleted',
        description: `Product '${product.name}' with ID ${product._id} was deleted`,
        createdBy: req.user._id,
        relatedTo: product._id,
        onModel: 'Product',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
    });
    await activity.save();

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

// @desc Get products by projectId and status
// @route GET /products/project/:projectId/:status
// @access private
const getProductsByProjectId = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const products = await Product.find({ projectId }).populate({
        path: 'projectId', 
        select: 'name'       
    }).lean();
    if (!products.length) {
        return res.status(404).json({ message: 'No products found for this project' });
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
    deleteProduct,
    listProductsByCategory,
    getProductsByProjectId
}