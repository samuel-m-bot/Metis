const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Conceptual', 'Functional', 'Technical', 'Prototype', 'Production', 'Schematic', 'Assembly', 'Detail'],
        required: true
    },
    revisionNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Regex to validate both 'A.1' format and '1.1' format
                return /^[A-Z]*\.?\d+(\.\d+)?$/.test(v);
            },
            message: props => `${props.value} is not a valid revision number!`
        }
    },
    status: {
        type: String,
        enum: ['Draft', 'In Review', 'Revised', 'Approved', 'Published', 'Archived', 'Checked Out', 'Checked In', 'On Hold'],
        default: 'Draft'
    },
    comments: [{
        text: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now },
    }],
    designers: [{
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
    attachment: {
        filePath: { type: String, required: false },  
        fileName: { type: String, required: false }   
    },
    classification: {
        type: String,
        enum: ['Confidential', 'Restricted', 'Public', 'Private'],
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false // Most designs will not be featured by default
    }
});

module.exports = mongoose.model('Design', designSchema);
