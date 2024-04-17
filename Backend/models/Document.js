const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: [ 'Requiremnts', 'Design', 'Devlopment', 'Manufacturing', 'Miantenance', 'End of Life']
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
        type: String,
        enum: ['Draft', 'In Review', 'Revised', 'Approved', 'Published', 'Archived', 'Checked Out', 'On Hold'],
        default: 'Draft'
    },
    relatedDocuments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    }],
});

module.exports = mongoose.model('Document', documentSchema);
