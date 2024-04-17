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
        required: true
    },
    lifecycleStatus: {
        type: String,
        required: true,
        enum: ['Concept', 'Development', 'Market', 'Retire'],
    },
    version: {
        type: String,
        required: false
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
        version: { type: String, required: false },
    },
});

module.exports = mongoose.model('Product', productSchema);
