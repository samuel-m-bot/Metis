const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema({
    systemType: {
        type: String,
        enum: ['ERP', 'SCM', 'CRM'],
        required: true
    },
    systemName: {
        type: String,
        required: true
    },
    apiUrl: {
        type: String,
        required: true
    },
    authenticationDetails: {
        username: String,
        password: String,
        token: String
    },
    dataMapping: [{
        plmField: String,
        externalSystemField: String
    }],
    lastSync: {
        type: Date
    },
    syncFrequency: {
        type: String,
        enum: ['Hourly', 'Daily', 'Weekly', 'Monthly']
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Integration', integrationSchema);
