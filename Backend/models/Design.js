const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
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
    version: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Draft', 'Review', 'Update', 'Final']
        
    },
    comments: [{
        type: String
    }],
    designer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    modificationDate: {
        type: Date
    },
    attachment: {
        filePath: { type: String, required: false },  
        fileName: { type: String, required: false }   
    },
    // linkedChangeRequests: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'ChangeRequest'
    // }],
});

module.exports = mongoose.model('Design', designSchema);
