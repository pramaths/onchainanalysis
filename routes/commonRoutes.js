
const express = require('express');
const { getCryptoData } = require("../services/analysis/modal");
const {addressController} = require('../controllers/common-blockchain/address');
const router = express.Router();

router.get("/crypto/:address", getCryptoData);
router.get("/:address/:chain", addressController);

module.exports = router;