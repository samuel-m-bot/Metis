const { Storage } = require('@google-cloud/storage');
const Document = require('../models/Document')
const Activity = require('../models/Activity')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const storage = new Storage();
const bucketName = 'metis_bucket_1'; 

// @desc Get all documents
// @route GET /documents
// @access private
const getAllDocuments = asyncHandler(async (req, res) => {
    const documents = await Document.find().populate({
        path: 'projectId',
        select: 'name'  
    }).lean();
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
    const {
        projectId, title, type, description, revisionNumber, associatedProductIDs, authors,
        status, relatedDocuments, classification
    } = req.body;

    // Validate required fields
    if (!projectId || !title || !type || !description || !revisionNumber || !authors || !status || !classification) {
        return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Validate revision number format
    if (!/^[A-Z]*\.?\d+(\.\d+)?$/.test(revisionNumber)) {
        return res.status(400).json({ message: 'Invalid revision number format' });
    }

    // Prepare the attachment data
    const attachment = req.fileUrl ? {
        filePath: req.fileUrl,
        fileName: req.file.originalname  // Assuming you still want to track the original file name
    } : undefined;

    const revision = {
        revisionNumber: revisionNumber,
        description: 'Initial creation of the document.',
        author: authors,
    }
    // Create new document with attachment if available
    const document = new Document({
        projectId,
        title,
        type,
        description,
        revisionNumber,
        authors,
        status,
        classification,
        attachment,
        revision
    });

    if (associatedProductIDs) document.associatedProductID = associatedProductIDs;
    if (relatedDocuments) document.relatedDocuments = relatedDocuments;

    // Automatically set the creation date to now
    document.creationDate = Date.now();

        let createdDocument;
    try {
        createdDocument = await document.save();
    } catch (error) {
        console.error("Error saving document:", error);
        return res.status(500).json({ message: 'Failed to save document', error: error.message });
    }

    if (!createdDocument) {
        return res.status(500).json({ message: 'Document not created' });
    }


    // const activity = new Activity({
    //     actionType: 'Created',
    //     description: `New document '${createdDocument.title}' was created with`,
    //     createdBy: req.user._id,
    //     relatedTo: createdDocument._id,
    //     onModel: 'Document',
    //     ipAddress: req.ip,
    //     deviceInfo: req.headers['user-agent']
    // });
    // await activity.save();

    res.status(201).json(createdDocument);

});

// @desc Update a document
// @route PATCH /documents/:id
// @access private
const updateDocument = asyncHandler(async (req, res) => {
    const documentId = req.params.id;
    const document = await Document.findById(documentId);
    if (!document) {
        return res.status(404).json({ message: 'Document not found' });
    }

    const fieldsToUpdate = ['projectId', 'title', 'type', 'description', 'revisionNumber', 'associatedProductIDs', 'authors', 'status', 'relatedDocuments', 'comments', 'classification'];
    fieldsToUpdate.forEach(field => {
        if (req.body.hasOwnProperty(field)) {
            document[field] = req.body[field];
        }
    });

    if (req.fileUrl) {
        document.attachment = {
            filePath: req.fileUrl,
            fileName: req.file.originalname  
        };
    }

    document.lastModifiedDate = Date.now();

    try {
        const updatedDocument = await document.save();
        const activity = new Activity({
            actionType: 'Updated',
            description: `Document '${updatedDocument.title}' was updated with ID ${updatedDocument._id}`,
            createdBy: req.user._id,
            relatedTo: updatedDocument._id,
            onModel: 'Document',
            ipAddress: req.ip,
            deviceInfo: req.headers['user-agent']
        });
        await activity.save();
        res.json({ message: `Document '${updatedDocument._id}' updated successfully.`, updatedDocument });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update document', error: error.message });
    }
});


// @desc Delete a document form the cloud and database
// @route DELETE /documents
// @access private
const deleteDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        return res.status(404).json({ message: 'Document not found' });
    }

    // First, delete the document's file from Google Cloud Storage if it exists
    if (document.attachment && document.attachment.filePath) {
        try {
            const bucket = storage.bucket(bucketName);
            const file = bucket.file(document.attachment.filePath);
            await file.delete(); // Deletes the file from the bucket
            console.log(`File ${document.attachment.filePath} deleted.`);
        } catch (err) {
            console.error('Failed to delete file from Google Cloud Storage:', err);
            return res.status(500).json({ message: 'Failed to delete document file from storage' });
        }
    }

    // Then, delete the document record from the database
    const result = await document.deleteOne();
    const reply = `Document ${result.name} with ID ${result._id} deleted`;
    
    const activity = new Activity({
        actionType: 'Deleted',
        description: `Document '${document.title}' with ID ${document._id} was deleted`,
        createdBy: req.user._id,
        relatedTo: document._id,
        onModel: 'Document',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
    });
    await activity.save();

    res.json({ message: reply });
});

// @desc Download a document file
// @route GET /documents/:id/download
// @access private
const downloadDocumentFile = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);
    if (!document || !document.attachment || !document.attachment.filePath) {
        return res.status(404).json({ message: 'Document not found or no attachment present' });
    }

    
    const filePath = document.attachment.filePath.split('https://storage.googleapis.com/metis_bucket_1/').pop();
    const fileName = document.attachment.fileName;

    console.log('Correct File Path:', filePath);
    console.log('File Name:', fileName);

    try {
        const options = {};

        const bucket = storage.bucket('metis_bucket_1');
        const file = bucket.file(filePath);

        console.log('Attempting to download:', file.name);

        res.attachment(fileName);

        const readStream = file.createReadStream(options);

        readStream.on('error', (err) => {
            console.error('Error during the file download:', err);
            res.status(500).json({ message: "Could not download the file: " + err.message });
        });

        const activity = new Activity({
            actionType: 'Downloaded',
            description: `File ${fileName} for document ID ${document._id} was downloaded`,
            createdBy: req.user._id,
            relatedTo: document._id,
            onModel: 'Document',
            ipAddress: req.ip,
            deviceInfo: req.headers['user-agent']
        });
        await activity.save();

        readStream.pipe(res);
    } catch (err) {
        console.error('Failed to download file from Google Cloud Storage:', err);
        res.status(500).json({ message: "Server error occurred" });
    }
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