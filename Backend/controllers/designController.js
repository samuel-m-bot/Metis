const Design = require('../models/Design')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

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
    const { productID, version, changes, status, comments, designer, attachments, versionNotes, linkedChangeRequests } = req.body

    // Validate required fields
    if (!productID || !version || !changes || !status || !designer) {
        return res.status(400).json({ message: 'Required fields are missing' })
    }

    // Create new design
    const design = new Design({ productID, version, changes, status, comments, designer, attachments, versionNotes, linkedChangeRequests })

    const createdDesign = await design.save()
    res.status(201).json(createdDesign);
})

// @desc Update an existing design
// @route PATCH /designs/:id
// @access private
const updateDesign = asyncHandler(async (req, res) => {
    const designId = req.params.id
    const design = await Design.findById(designId)

    if (!design) {
        return res.status(404).json({ message: 'Design not found' })
    }

    // Update fields if provided
    design.version = req.body.version || design.version
    design.changes = req.body.changes || design.changes
    design.status = req.body.status || design.status
    design.comments = req.body.comments || design.comments
    design.designer = req.body.designer || design.designer
    design.creationDate = req.body.creationDate || design.creationDate
    design.modificationDate = req.body.modificationDate || design.modificationDate
    design.approvalStatus = req.body.approvalStatus || design.approvalStatus
    design.approver = req.body.approver || design.approver
    design.attachments = req.body.attachments || design.attachments
    design.versionNotes = req.body.versionNotes || design.versionNotes
    design.linkedChangeRequests = req.body.linkedChangeRequests || design.linkedChangeRequests

    const updatedDesign = await design.save()
    res.json({ message: `Design '${updatedDesign._id}' updated` })
})

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

module.exports = {
    getAllDesigns,
    getDesignById,
    createNewDesign,
    updateDesign,
    deleteDesign
}