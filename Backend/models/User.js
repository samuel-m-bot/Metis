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
        enum: ['Admin', 'Project Manager', 'Engineer', 'Quality Control', 'Sales Representative', 'Customer Support', 'IT Specialist'],
        required: true
    }],
    department: {
        type: String,
        required: true,
        enum: ['Engineering', 'Product Management', 'Manufacturing', 'Quality Assurance', 
        'Supply Chain', 'Customer Support', 'Sales and Marketing', 
        'IT and Systems', 'Operations', 'Research and Development']
    }
});

module.exports = mongoose.model('User', userSchema);
