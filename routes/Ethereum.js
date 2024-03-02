const express = require('express');
const router = express.Router();
const { getWalletTransactions } = require('../services/blockchain/Ethereum/transaction');

router.get('/eth/:chain/:address/:pagesize?', getWalletTransactions);

module.exports = router;
