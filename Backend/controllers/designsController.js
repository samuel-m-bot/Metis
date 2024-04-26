const { Storage } = require('@google-cloud/storage');
const Design = require('../models/Design')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const storage = new Storage();
const bucketName = 'metis_bucket_1'; 

// @desc Get all designs
// @route GET /designs
// @access private
const getAllDesigns = asyncHandler(async (req, res) => {
    const designs = await Design.find().lean()
    if(!designs?.length){
        return res.status(400).json({ message: 'No designs found'})
    }
    res.json(designs)
})

// @desc Get specific designs
// @route GET /designs
// @access private
const getDesignById = asyncHandler(async (req, res) => {
    const designs = await Design.findById(req.params.id).lean()
    if(!designs){
        return res.status(400).json({ message: 'No design found with that ID'})
    }
    res.json(designs)
})

// @desc Create a new design
// @route POST /designs
// @access private
const createNewDesign = asyncHandler(async (req, res) => {
    const { projectId, productID, name, description, type, revisionNumber, status, designers, classification, attachment } = req.body;

    // Validate required fields
    if (!projectId || !productID || !name || !description || !type || !revisionNumber || !status || !designers || !classification) {
        return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Validate revision number format
    if (!/^[A-Z]*\.?\d+(\.\d+)?$/.test(revisionNumber)) {
        return res.status(400).json({ message: 'Invalid revision number format' });
    }

    // Create new design with attachment if available
    const design = new Design({
        projectId,
        productID,
        name,
        description,
        type,
        revisionNumber,
        status,
        designers,
        classification,
        attachment
    });

    const createdDesign = await design.save();
    res.status(201).json(createdDesign);
});

// @desc Update an existing design
// @route PATCH /designs/:id
// @access private
const updateDesign = asyncHandler(async (req, res) => {
    const { projectId, productID, name, description, type, revisionNumber, status, designers, classification, attachment } = req.body;
    const designId = req.params.id;
    const design = await Design.findById(designId);

    if (!design) {
        return res.status(404).json({ message: 'Design not found' });
    }

    // Update fields if provided
    design.projectId = projectId || design.projectId;
    design.productID = productID || design.productID;
    design.name = name || design.name;
    design.description = description || design.description;
    design.type = type || design.type;
    design.revisionNumber = revisionNumber || design.revisionNumber;
    design.status = status || design.status;
    design.designers = designers || design.designers;
    design.classification = classification || design.classification;
    if (attachment) {
        design.attachment = attachment;
    }

    // Automatically set the last modified date to now
    design.lastModifiedDate = Date.now();

    const updatedDesign = await design.save();
    res.json({ message: `Design '${updatedDesign._id}' updated successfully.` });
});

// @desc Delete a design
// @route DELETE /designs/:id
// @access private
const deleteDesign = asyncHandler(async (req, res) => {
    const design = await Design.findById(req.params.id);

    if (!design) {
        return res.status(404).json({ message: 'Design not found' });
    }

    // If there's an attachment, attempt to delete it from Google Cloud Storage
    if (design.attachment && design.attachment.filePath) {
        const filePath = design.attachment.filePath.replace(/^https?:\/\/storage.googleapis.com\/metis_bucket_1\//, '');
        const file = storage.bucket(bucketName).file(filePath);

        try {
            await file.delete();
            console.log(`File deleted successfully from cloud storage for design ID: ${req.params.id}`);
        } catch (error) {
            console.error('Failed to delete design file from cloud storage:', error);
            return res.status(500).json({ message: 'Failed to delete design file from cloud storage', error: error.message });
        }
    }

    // Proceed to delete the design document from the database
    const result = await design.deleteOne();
    const reply = `Design '${result.name}' with ID ${result._id} deleted`;

    res.json(reply);
});


// @desc Download a design file
// @route GET /designs/:id/download
// @access private
const downloadDesignFile = asyncHandler(async (req, res) => {
    const designId = req.params.id;
    console.log(`Starting download for design ID: ${designId}`);

    const design = await Design.findById(designId);
    if (!design || !design.attachment || !design.attachment.filePath) {
        console.log(`Design not found or no attachment present for design ID: ${designId}`);
        return res.status(404).json({ message: 'Design not found or no file attached' });
    }

    try {
        const filePath = design.attachment.filePath.replace(/^https?:\/\/storage.googleapis.com\/metis_bucket_1\//, '');
        const fileName = design.attachment.fileName;
        console.log(`File Path: ${filePath}`);
        console.log(`File Name: ${fileName}`);
        console.log(`Bucket Name: metis_bucket_1`);

        const file = storage.bucket('metis_bucket_1').file(filePath);

        res.attachment(fileName);

        const readStream = file.createReadStream();

        readStream.on('error', (error) => {
            console.error(`Failed to download file: ${error.message}`);
            console.log(`Error during the file download for file: ${filePath}`);
            res.status(500).json({ message: "Could not download the file: " + error.message });
        });

        readStream.pipe(res).on('finish', () => {
            console.log(`Download successful for file: ${filePath}`);
        });

    } catch (error) {
        console.error(`Error during file download: ${error.message}`);
        console.log(`Exception caught during the file download for design ID: ${designId}`);
        res.status(500).send({ message: "Server error during file download." });
    }
});

// @desc Get designs by projectId
// @route GET /designs/project/:projectId
// @access private
const getDesignsByProjectId = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const designs = await Design.find({ projectId }).lean();
    if (!designs.length) {
        return res.status(404).json({ message: 'No designs found for this project' });
    }
    res.json(designs);
});

// @desc Toggle the 'isFeatured' status of a design
// @route PATCH /designs/:id/toggle-featured
// @access private
const toggleFeaturedDesign = asyncHandler(async (req, res) => {
    const designId = req.params.id;
    const design = await Design.findById(designId);

    if (!design) {
        return res.status(404).json({ message: 'Design not found' });
    }

    // Toggle the isFeatured status
    design.isFeatured = !design.isFeatured;

    const updatedDesign = await design.save();
    res.json({
        message: `Design '${updatedDesign.name}' is now ${updatedDesign.isFeatured ? 'featured' : 'not featured'}.`
    });
});

module.exports = {
    getAllDesigns,
    getDesignById,
    createNewDesign,
    updateDesign,
    deleteDesign,
    downloadDesignFile,
    getDesignsByProjectId,
    toggleFeaturedDesign
}