const axios = require('axios');
const asyncHandler = require('express-async-handler')

// Function to fetch contacts from Salesforce
const fetchSalesforceContacts = asyncHandler(async (req, res) => {
    const url = 'https://EU45.salesforce.com/services/data/v60.0/query';
    const query = 'SELECT Id, FirstName, LastName, Email, Account.Name, Title FROM Contact LIMIT 10';


    const accessToken = req.session.accessToken; 
    if (!accessToken) {
        return res.status(401).json({ message: 'Salesforce access token is not available. Please log in again.' });
    }

    try {
        const response = await axios.get(`${url}?q=${encodeURIComponent(query)}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.data.records && response.data.records.length > 0) {
            res.json(response.data.records);  
        } else {
            console.log('No contacts found');
            res.status(404).json({ message: 'No contacts found' });  
        }
    } catch (error) {
        console.error('Error fetching contacts from Salesforce:', error);
        res.status(500).json({ message: 'Failed to fetch contacts from Salesforce' });
    }
});

module.exports = {
    fetchSalesforceContacts,
}
