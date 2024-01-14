const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
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
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    changeRequests: [{
        type: Schema.Types.ObjectId,
        ref: 'ChangeRequest'
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
