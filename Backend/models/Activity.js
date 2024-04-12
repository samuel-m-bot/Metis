const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    actionType: {
        type: String,
        required: true,
        enum: ['Created', 'Updated', 'Reviewed', 'Commented', 'Completed', 'Approved', 'Rejected', 'Deleted', 'Other'],
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    relatedTo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel',
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Project', 'ChangeRequest', 'Document', 'Product', 'Design', 'Task'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Activity', activitySchema);
