const express = require('express');
const { getAllTransactionsController } = require('../services/blockchain/Bitcoin/transaction');

const router = express.Router();

router.get('/bitcoin/transactions/:address', getAllTransactionsController);

module.exports = router;
