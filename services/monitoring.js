
const axios = require('axios');

const API_BASE_URL = 'https://services.tokenview.io/vipapi';
const API_KEY = "0I96KfBNlfQ9kUjrOUWn";

exports.addAddress = async (req, res) => {
  const { address } = req.body;
  const url = `${API_BASE_URL}/monitor/address/add/eth/${address}?apikey=${API_KEY}`;

  try {
    const response = await axios.post(url);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ message: error.message });
  }
};

exports.listAddresses = async (req, res) => {
  const url = `${API_BASE_URL}/monitor/address/list/eth?page=0&apikey=${API_KEY}`;

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
