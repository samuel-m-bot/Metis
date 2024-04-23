const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started'
    },
    dueDate: {
        type: Date
    }
}, { timestamps: true });

const checklistItemSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'On Hold', 'Completed', 'Reviewed', 'Approved', 'Cancelled'],
        default: 'Not Started',
        required: true
    },    
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        required: true
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    taskType: {
        type: String,
        enum: ['Review', 'Set up Review', 'Update', 'Approve', 'Create', 'Verify', 'Revise', 'Release', 'Archive', 'Observe', 'Others'],
        required: true
    },    
    dueDate: {
        type: Date
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    completionDate: {
        type: Date
    },
    relatedTo: {
        type: String,
        enum: ['Design', 'Document', 'Product', 'Project'],
        required: true
    },
    assignedDesign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Design'
    },
    assignedDocument: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    },
    assignedProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    review: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    },
    subtasks: [subtaskSchema],
    checklist: [checklistItemSchema],
    comments: [commentSchema]
});

module.exports = mongoose.model('Task', taskSchema);
