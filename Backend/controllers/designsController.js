const Design = require('../models/Design')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all designs
// @route GET /designs
// @access private
const getAllDesigns = asyncHandler(async (req, res) => {
    const designs = await Design.find().lean()
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
    const { projectId, productID, name, description, type, revisionNumber, status, designer } = req.body;

    // Validate required fields
    if (!projectId || !productID || !name || !description || !type || !revisionNumber || !status || !designer) {
        return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Validate revision number format
    if (!/^[A-Z]*\.?\d+(\.\d+)?$/.test(revisionNumber)) {
        return res.status(400).json({ message: 'Invalid revision number format' });
    }

    // Prepare the attachment data
    const attachment = req.file ? {
        filePath: req.file.path,
        fileName: req.file.filename
    } : undefined;

    // Create new design with attachment if available
    const design = new Design({
        projectId,
        productID,
        name,
        description,
        type,
        revisionNumber,
        status,
        designer,
        attachment
    });

    const createdDesign = await design.save();
    res.status(201).json(createdDesign);
});


// @desc Update an existing design
// @route PATCH /designs/:id
// @access private
const updateDesign = asyncHandler(async (req, res) => {
    const designId = req.params.id;
    const design = await Design.findById(designId);

    if (!design) {
        return res.status(404).json({ message: 'Design not found' });
    }

    // Update fields if provided
    design.projectId = req.body.projectId || design.projectId;
    design.productID = req.body.productID || design.productID;
    design.name = req.body.name || design.name;
    design.description = req.body.description || design.description;
    design.type = req.body.type || design.type;
    design.revisionNumber = req.body.revisionNumber || design.revisionNumber;
    design.version = req.body.version || design.version;
    design.status = req.body.status || design.status;
    design.comments = req.body.comments || design.comments;
    design.designers = req.body.designers || design.designers;

    // Automatically set the last modified date to now
    design.lastModifiedDate = Date.now();

    // Prepare the attachment data if a file is uploaded
    if (req.file) {
        design.attachment = {
            filePath: req.file.path,  // The path to the file in the filesystem
            fileName: req.file.filename 
        };
    }

    const updatedDesign = await design.save();
    res.json({ message: `Design '${updatedDesign._id}' updated successfully.` });
});

// @desc Delete a design
// @route DELETE /designs
// @access private
const deleteDesign = asyncHandler(async (req, res) => {
    const design = await Design.findById(req.params.id);

    if (!design) {
        return res.status(404).json({ message: 'Design not found' });
    }

    const result = await design.deleteOne()

    const reply = `Design ${result.name} with ID ${result._id} deleted`

    res.json(reply)
})

// @desc Download a design file
// @route GET /designs/:id/download
// @access private
const downloadDesignFile = asyncHandler(async (req, res) => {
    const design = await Design.findById(req.params.id);

    if (!design) {
        return res.status(404).json({ message: 'Design not found' });
    }

    const file = design.attachment.filePath;
    
    // Set the correct headers on the response to prompt download
    res.download(file, design.attachment.fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
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


module.exports = {
    getAllDesigns,
    getDesignById,
    createNewDesign,
    updateDesign,
    deleteDesign,
    downloadDesignFile,
    getDesignsByProjectId
}