const mongoose = require('mongoose');

const changeRequestSchema = new mongoose.Schema({
    requestedBy: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    priority: {
        type: String
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
        postedBy: String,
        postedDate: Date
    }],
    relatedDocuments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    },
    relatedDesigns: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Design'
    },
    associatedTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
});

module.exports = mongoose.model('ChangeRequest', changeRequestSchema);
