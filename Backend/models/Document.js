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
    revisionNumber: {
        type: String,
        required: true
    },
    associatedProductID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    author: {
        type: String
    },
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
    approvalStatus: {
        type: String
    },
    approver: {
        type: String
    },
    content: {
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
