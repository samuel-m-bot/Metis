const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    description: {
        type: String,
        required: true
    },
    projectManagerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
        default: 'Not Started'
    },
    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    associatedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    relatedDesigns: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Design'
    }],
    notes: [{
        type: String
    }],
    attachments: [{
        fileName: String,
        filePath: String
    }]
});

module.exports = mongoose.model('Project', projectSchema);
