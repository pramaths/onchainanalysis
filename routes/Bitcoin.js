const express = require('express');
const { getAllTransactionsController } = require('../services/blockchain/Bitcoin/transaction');
const {getAllTransactionsControllers} = require('../services/blockchain/Bitcoin/btcChain/endPoint_functions');
const {getTxHashDetails} = require('../controllers/btc/txHashController');
const router = express.Router();

router.get('/bitcoin/address/:address', getAllTransactionsController);
router.get('/bitcoin/trace/transactions/:address', getAllTransactionsControllers);
router.get('/bitcoin/txHash/:txhash', getTxHashDetails );

module.exports = router;
