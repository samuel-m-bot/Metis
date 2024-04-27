// models/Revision.js
const mongoose = require('mongoose');

const revisionSchema = new mongoose.Schema({
    revisionNumber: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    date: {
        type: Date,
        default: Date.now
    },
    changeRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChangeRequest',
        required: false  
    }
});

module.exports = revisionSchema;