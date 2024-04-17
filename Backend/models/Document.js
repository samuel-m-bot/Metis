const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    attachment: {
        filePath: { type: String, required: true }, 
        fileName: { type: String, required: true }  
    },
    revisionNumber: {
        type: String,
        required: true
    },
    associatedProductID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    authors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    creationDate: {
        type: Date,
        default: Date.now
    },
    lastModifiedDate: {
        type: Date
    },
    status: {
        type: String
    },
    tags: [{
        type: String
    }],
    relatedDocuments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    }],
});

module.exports = mongoose.model('Document', documentSchema);
