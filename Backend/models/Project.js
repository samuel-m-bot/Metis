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
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: ['Admin', 'Engineer', 'Quality Control', 'Designer', 'Analyst', 'Observer'] // Define roles as needed
        },
        permissions: {
            type: [String],
            enum: ['Read', 'Write', 'Delete'],
            required: true
        }
    }],
    associatedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    projectTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
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
