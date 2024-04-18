const mongoose = require('mongoose');

const changeRequestSchema = new mongoose.Schema({
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Requested', 'Reviewed', 'Approved', 'Implemented', 'Closed', 'Rejected']
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium',
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    estimatedCompletionDate: {
        type: Date
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        text: String,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        postedDate: {
            type: Date,
            default: Date.now
        }
    }],
    relatedDocuments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    }],
    relatedDesigns: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Design'
    }],
    associatedTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    relatedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

module.exports = mongoose.model('ChangeRequest', changeRequestSchema);
