const express = require('express');
const router = express.Router();
const { getWalletTransactions } = require('../services/blockchain/Ethereum/transaction');
const {getArbTrans}=require("../services/blockchain/Ethereum/arbitrum")
router.get('/eth/:chain/:address/:pagesize?', getWalletTransactions);
router.get("/arb/:address", getArbTrans);
module.exports = router;
