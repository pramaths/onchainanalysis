const express = require('express');
const { getAllTransactionsController } = require('../services/blockchain/Bitcoin/transaction');
const {getAllTransactionsControllers} = require('../services/blockchain/Bitcoin/btcChain/endPoint_functions');
const router = express.Router();

router.get('/bitcoin/transactions/:address', getAllTransactionsController);
router.get('/bitcoin/trace/transactions/:address', getAllTransactionsControllers);

module.exports = router;
