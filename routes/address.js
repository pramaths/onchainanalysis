
const express = require('express');
const { getCryptoData } = require("../services/analysis/modal");

const router = express.Router();

router.get("/crypto/:address", getCryptoData);

module.exports = router;