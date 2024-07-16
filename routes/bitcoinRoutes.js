const express = require('express');
const { getAllTransactionsController } = require('../services/blockchain/Bitcoin/transaction');
const {getAllTransactionsControllers} = require('../controllers/btc/transactionController');
const {getTxHashDetails} = require('../controllers/btc/txHashController');
const router = express.Router();

router.get('/address/:address', getAllTransactionsController);
router.get('/trace/transactions/:address', getAllTransactionsControllers);
router.get('/txHash/:txhash', getTxHashDetails );

module.exports = router;
