
const express = require('express');
const { getCryptoData } = require("../services/analysis/modal");

const router = express.Router();

// router.get("/crypto/:address", getCryptoData);
// router.get("/crypto/:address/:chain", getCryptoData);

module.exports = router;