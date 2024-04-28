const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    actionType: {
        type: String,
        required: true,
        enum: ['Created', 'Updated', 'Reviewed', 'Commented', 'Completed', 'Approved', 
        'Rejected', 'Deleted', 'RevisionUpdate' , 'Checked Out', 'Checked In', 
        'Added', 'Removed','Cancelled','Implemented','Other', 'Downloaded'],
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    },
    relatedTo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel' 
    },
    onModel: {
        type: String,
        required: true,
        enum: ['ChangeRequest', 'Product', 'Document', 'Task', 'Design', 'Review', 'Project'] 
    },
    timestamp: {
        type: Date,
        default: Date.now 
    },
    ipAddress: {
        type: String,
        required: false 
    },
    deviceInfo: {
        type: String,
        required: false 
    }
});

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
