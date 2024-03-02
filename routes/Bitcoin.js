const express = require('express');
const { getAllTransactionsController } = require('../services/blockchain/Bitcoin/transaction');
const { getAllTransactionController } = require('../services/blockchain/Bitcoin/tokenview');

const router = express.Router();

router.get('/bitcoin/transactions/:address', getAllTransactionsController);
router.get('/bitcoins/transactions/:address', getAllTransactionController);

module.exports = router;
