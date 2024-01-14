const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    version: {
        type: Number,
        required: true
    },
    changes: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    comments: [{
        type: String
    }],
    designer: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    modificationDate: {
        type: Date
    },
    approvalStatus: {
        type: String
    },
    approver: {
        type: String
    },
    attachments: [{
        type: String // URL or reference to files
    }],
    versionNotes: {
        type: String
    },
    linkedChangeRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChangeRequest'
    }]
});

module.exports = mongoose.model('Design', designSchema);
