const Document = require('../models/Document')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all documents
// @route GET /documents
// @access private
const getAllDocuments = asyncHandler(async (req, res) => {
    const documents = await Document.find().lean()
    if(!documents?.length){
        return res.status(400).json({ message: 'No documents found'})
    }
    res.json(documents)
})

// @desc Get specific documents
// @route GET /documents
// @access private
const getDocumentById = asyncHandler(async (req, res) => {
    const documents = await Document.findById(req.params.id).lean()
    if(!documents){
        return res.status(400).json({ message: 'No document found with that ID'})
    }
    res.json(documents)
})

// @desc Create new document
// @route POST /documents
// @access private
const createNewDocument = asyncHandler(async (req, res) => {
    const {
        name, type, revisionNumber, associatedProductID, author, creationDate, lastModifiedDate, status,
        approvalStatus, approver, content, tags, relatedDocuments
    } = req.body

    // Confirm data is all there to create a document
    if (!name || !type || !revisionNumber) {
        return res.status(400).json({ message: 'Name, type, and revision number are required' })
    }

    // Check for duplicate documents
    const duplicate = await Document.findOne({ name }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate document name' })
    }

    const documentObject = {
        name, type, revisionNumber, associatedProductID, author, creationDate, lastModifiedDate,
        status, approvalStatus, approver, content, tags, relatedDocuments
    }

    // Create and store the new document
    const document = await Document.create(documentObject)

    if (document) {
        res.status(201).json({ message: `New document '${name}' created` })
    } else {
        res.status(400).json({ message: 'Invalid document data received' })
    }
})

// @desc Update a document
// @route PATCH /documents/:id
// @access private
const updateDocument = asyncHandler(async (req, res) => {
    const documentId = req.params.id
    const document = await Document.findById(documentId)

    if (!document) {
        return res.status(404).json({ message: 'Document not found' })
    }

    // Update fields if they are provided
    document.name = req.body.name || document.name
    document.type = req.body.type || document.type
    document.revisionNumber = req.body.revisionNumber || document.revisionNumber
    document.associatedProductID = req.body.associatedProductID || document.associatedProductID
    document.author = req.body.author || document.author
    document.creationDate = req.body.creationDate || document.creationDate
    document.lastModifiedDate = req.body.lastModifiedDate || document.lastModifiedDate
    document.status = req.body.status || document.status
    document.approvalStatus = req.body.approvalStatus || document.approvalStatus
    document.approver = req.body.approver || document.approver
    document.content = req.body.content || document.content
    document.tags = req.body.tags || document.tags
    document.relatedDocuments = req.body.relatedDocuments || document.relatedDocuments

    const updatedDocument = await document.save()
    res.json({ message: `Document '${updatedDocument.name}' updated` })
})

// @desc Delete a document
// @route DELETE /documents
// @access private
const deleteDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        return res.status(404).json({ message: 'Document not found' });
    }

    const result = await document.deleteOne()

    const reply = `Document ${result.name} with ID ${result._id} deleted`

    res.json(reply)
})

//Endpoint to be able 

module.exports = {
    getAllDocuments,
    getDocumentById,
    createNewDocument,
    updateDocument,
    deleteDocument
}