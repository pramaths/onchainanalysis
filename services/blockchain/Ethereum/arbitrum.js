const axios = require("axios");

const getArbTrans = async (req, res) => {
    try {
        const { address } = req.params; // Extract parameters from the request

        // Define the URL
        const url = "https://api.arbiscan.io/api";

        // Define the parameters
        const params = {
            module: "account",
            action: "txlistinternal",
            address: address,
            startblock: 0,
            endblock: 99999999,
            page: 1,
            offset: 10,
            sort: "asc",
            apikey: "WHUBUNSVUZ5VPT147KWT8TI5RJP7AS4EG9", // Replace with your actual API key
        };

        const response = await axios.get(url, { params });
        res.json(response.data); // Send the data part of the response object to the client
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "An error occurred while fetching transactions" });
    }
};

module.exports = { getArbTrans };
