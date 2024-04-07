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
        enum: ['Ongoing', 'Completed', 'Upcoming'],
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
        enum: ['Review', 'Update', 'Approve', 'Others'],
        required: true
    },
    projectID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
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
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel',
        required: true
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Project', 'ChangeRequest']
    },
    subtasks: [subtaskSchema],
    checklist: [checklistItemSchema],
    comments: [commentSchema]
});

module.exports = mongoose.model('Task', taskSchema);
