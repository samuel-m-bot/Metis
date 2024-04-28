const Product = require('../models/Product')
const Activity = require('../models/Activity')
const asyncHandler = require('express-async-handler')
const axios = require('axios');
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

    const revision = {
        revisionNumber: revisionNumber,
        description: 'Initial creation of the product.',
        author: authors,
    }

    // Create new product object
    const productObject = {
        projectId, name, description, category, lifecycleStatus, type,
        revisionNumber, physicalAttributes, digitalAttributes, classification, status, revision
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

// @desc Fetch Salesforce analytics report data
// @route GET /services/data/v60.0/analytics/reports/{reportId}
// @access Private
const fetchSalesforceAnalytics = async (accessToken, reportId) => {
    const url = `https://eu45.salesforce.com/services/data/v60.0/analytics/reports/${reportId}`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data; 
    } catch (error) {
      console.error('Error fetching Salesforce analytics:', error);
      return null;
    }
  };  

// @desc Fetch Salesforce Product Performance Report
// @route GET /analytics/product-performance
// @access Private
const fetchProductPerformanceReport = asyncHandler(async (req, res) => {
    const accessToken = req.session.accessToken; 
    if (!accessToken) {
        return res.status(401).json({ message: 'Unauthorized - No access token' });
    }

    const reportId = "00O7R00000An8luUAB"; // Hardcoded report ID for the product report in salesforce
    try {
        const reportData = await fetchSalesforceAnalytics(accessToken, reportId);
        if (reportData) {
            res.json({
                success: true,
                data: reportData
            });
        } else {
            res.status(404).json({ message: 'Report data not found' });
        }
    } catch (error) {
        console.error('Error fetching product performance report:', error);
        res.status(500).json({ message: 'Failed to fetch report data' });
    }
});

//Link Product To Project

//Update Product Status
module.exports = {
    getAllProducts,
    getProductById,
    createNewProduct,
    updateProduct,
    deleteProduct,
    listProductsByCategory,
    getProductsByProjectId,
    fetchSalesforceAnalytics,
    fetchProductPerformanceReport
}