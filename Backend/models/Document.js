const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: [ 'Requiremnts', 'Design', 'Devlopment', 'Manufacturing', 'Miantenance', 'End of Life']
    },
    description: {
        type: String,
        required: true
    },
    attachment: {
        filePath: { type: String, required: true }, 
        fileName: { type: String, required: true }  
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
    associatedProductIDs: [{
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
        type: String,
        enum: ['Draft', 'In Review', 'Revised', 'Approved', 'Published', 'Archived', 'Checked Out', 'On Hold'],
        default: 'Draft'
    },
    relatedDocuments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    }],
    comments: [{
        text: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now },
    }],
});

module.exports = mongoose.model('Document', documentSchema);
