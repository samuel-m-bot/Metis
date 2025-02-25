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
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Requested', 'Revise' , 'Approved', 'Implemented', 'Rejected']
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium',
        required: true
    },
    dateRequested: {
        type: Date,
        default: Date.now
    },
    estimatedCompletionDate: {
        type: Date
    },
    approvalDate: {
        type: Date,
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
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    mainItem: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Document', 'Product', 'Design']
    },
    changeType: {
        type: String,
        required: true,
        enum: ['Corrective', 'Preventive', 'Enhancement']
    },
    riskAssessment: {
        type: String,
        required: true
    },
    impactLevel: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        required: true
    },
    revisionType: {
        type: String,
        required: true,
        enum: ['Major', 'Minor'] 
    }
});

module.exports = mongoose.model('ChangeRequest', changeRequestSchema);