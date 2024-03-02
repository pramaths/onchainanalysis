const axios = require('axios');

// Replace 'your_api_key_here' with your actual API key from Tokenview
const API_KEY = 'your_api_key_here';

const getWebhookHistory = async (coin, page = 1) => {
    const url = `https://services.tokenview.io/vipapi/monitor/webhookhistory/${coin}?page=${page}&apikey=${API_KEY}`;
    
    try {
        const response = await axios.get(url);
        // Process and return the response data here as needed
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching webhook history:', error.message);
        // Handle the error appropriately
        throw error;
    }
};

// Example usage:
// getWebhookHistory('eth', 1).then(data => console.log(data));
