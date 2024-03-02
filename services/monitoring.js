
const axios = require('axios');

const API_BASE_URL = 'https://services.tokenview.io/vipapi';
const API_KEY = "synLe1RAw9QvxMEaeovN";

exports.addAddress = async (req, res) => {
  const { address } = req.params;
  const url = `${API_BASE_URL}/monitor/address/add/eth/${address}?apikey=${API_KEY}`;

  try {
    const response = await axios.post(url);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ message: error.message });
  }
};

exports.listAddresses = async (req, res) => {
  const page = req.query.page || 5; 
  const url = `${API_BASE_URL}/monitor/address/list/eth?page=${page}&apikey=${API_KEY}`;

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ message: error.message });
  }
};
