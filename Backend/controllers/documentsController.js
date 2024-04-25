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
    const documents = await Document.findById(req.params.id).populate({
        path: 'authors',
        select: 'firstName surname'  
    }).lean();
    if(!documents){
        return res.status(400).json({ message: 'No document found with that ID'})
    }
    res.json(documents)
})

// @desc Create new document
// @route POST /documents
// @access private
const createNewDocument = asyncHandler(async (req, res) => {
    const {projectId, title, type, description, revisionNumber, associatedProductIDs, authors, 
        status, relatedDocuments, classification } = req.body;

    // Validate required fields
    if (!projectId || !title || !type || !description || !revisionNumber || !authors || !status || !classification) {
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

    // Create new document with attachment if available
    const docuemnt = new Document({
        projectId,
        title,
        type,
        description,
        revisionNumber,
        authors,
        status,
        classification,
        attachment
    });

    if(associatedProductIDs) docuemnt.associatedProductID = associatedProductIDs
    if(relatedDocuments) docuemnt.relatedDocuments = relatedDocuments

    // Automatically set the creation  date to now
    docuemnt.creationDate = Date.now();

    const createdDocuemnt = await docuemnt.save();
    res.status(201).json(createdDocuemnt);
})

// @desc Update a document
// @route PATCH /documents/:id
// @access private
const updateDocument = asyncHandler(async (req, res) => {
    const documentId = req.params.id;
    const document = await Document.findById(documentId);

    if (!document) {
        return res.status(404).json({ message: 'document not found' });
    }

    // Update fields if provided
    document.projectId = req.body.projectId || document.projectId;
    document.title = req.body.title || document.title;
    document.type = req.body.type || document.type;
    document.description = req.body.description || document.description;
    document.revisionNumber = req.body.revisionNumber || document.revisionNumber;
    document.associatedProductIDs = req.body.associatedProductIDs || document.associatedProductIDs;
    document.authors = req.body.authors || document.authors;
    document.status = req.body.status || document.status;
    document.relatedDocuments = req.body.relatedDocuments || document.relatedDocuments;
    document.comments = req.body.comments || document.comments;
    document.classification = req.body.classification || document.classification;
    // Automatically set the last modified date to now
    document.lastModifiedDate = Date.now();

    // Prepare the attachment data if a file is uploaded
    if (req.file) {
        document.attachment = {
            filePath: req.file.path,  // The path to the file in the filesystem
            fileName: req.file.filename 
        };
    }

    const updateddocument = await document.save();
    res.json({ message: `document '${updateddocument._id}' updated successfully.` });
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

// @desc Download a docuemnt file
// @route GET /docuemnts/:id/download
// @access private
const downloadDocumentFile = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);
    if (!document || !document.attachment || !document.attachment.filePath) {
        return res.status(404).json({ message: 'Document not found' });
    }

    const filePath = document.attachment.filePath;
    const fileName = document.attachment.fileName;

    res.download(filePath, fileName, function(err) {
        if (err) {
            // handle errors
            res.status(500).send({ message: "Could not download the file: " + err });
        }
    });
});

// @desc Get documents by projectId
// @route GET /documents/project/:projectId
// @access private
const getDocumentsByProjectId = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const documents = await Document.find({ projectId }).lean();
    if (!documents.length) {
        return res.status(404).json({ message: 'No documents found for this project' });
    }
    res.json(documents);
});


module.exports = {
    getAllDocuments,
    getDocumentById,
    createNewDocument,
    updateDocument,
    deleteDocument,
    downloadDocumentFile,
    getDocumentsByProjectId
}