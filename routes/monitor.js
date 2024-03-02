// routes.js

const express = require('express');
const router = express.Router();
const { addAddress, listAddresses } = require('../services/monitoring');

router.post('/monitor/address/add/:address', addAddress);
router.get('/monitor/address/list', listAddresses);

module.exports = router;
