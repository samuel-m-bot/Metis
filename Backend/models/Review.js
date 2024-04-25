const mongoose = require('mongoose');

const reviewerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewDate: {
        type: Date,
        default: Date.now
    },
    feedback: {
        type: String,
        required: false 
    },
    decision: {
        type: String,
        enum: ['Approved', 'Rejected', 'Pending'],
        default: 'Pending' 
    }
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({ 
    itemReviewed: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Document', 'ChangeRequest', 'Design', 'Product']
    },
    reviewers: [reviewerSchema],
    status: {
        type: String,
        enum: ['In Review', 'Completed', 'Rejected'],
        default: 'In Review'
    },
    initiationDate: {
        type: Date,
        default: Date.now  
    },
    reviewType: {
        type: String,
        enum: ['Update'],
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);