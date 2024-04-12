const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        enum: ['Admin', 'Project Manager', 'Quality Assurance', 'User', 'Viewer'],
        default: 'Viewer'
    }]
});

module.exports = mongoose.model('User', userSchema);
