const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
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
    category: {
        type: String,
        required: true,
        enum: ['Electronics', 'Apparel', 'Home Goods', 'Books', 'Tools', 
        'Healthcare', 'Toys', 'Groceries', 'Mobile Apps', 'Software',]
    },
    lifecycleStatus: {
        type: String,
        required: true,
        enum: ['Concept', 'Development', 'Market', 'Retire'],
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
    partNumber: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    documents: [{
        type: Schema.Types.ObjectId,
        ref: 'Document'
    }],
    type: {
        type: String,
        required: true,
        enum: ['Physical', 'Software', 'Service', 'Other']
    },
    physicalAttributes: {
        material: { type: String, required: false },
        color: { type: String, required: false },
        dimensions: { type: String, required: false },
    },
    digitalAttributes: {
        softwareType: { type: String, required: false }, // e.g., Web, Mobile, Desktop
    },
    classification: {
        type: String,
        enum: ['Confidential', 'Restricted', 'Public', 'Private'],
        required: true
    },
    status: {
        type: String,
        enum: ['Draft', 'In Review', 'Revised', 'Published', 'Archived', 'Checked Out', 'Checked In'],
        default: 'Draft'
    },
});

module.exports = mongoose.model('Product', productSchema);
