const express = require('express');
const { getAllTransactionsController } = require('../services/blockchain/Bitcoin/transaction');
const {getAllTransactionsControllers, getOutgoingTransactions} = require('../controllers/btc/transactionController');
const {getTxHashDetails} = require('../controllers/btc/txHashController');
const {getDetailsController} = require('../controllers/btc/addressController');
const router = express.Router();

router.get('/address/:address/details', getDetailsController);
router.get('/address/:address', getAllTransactionsController);
router.get('/stream/transactions/:address', getAllTransactionsControllers);
router.get('/txhash/:txhash', getTxHashDetails );
router.get('/address/:address/outgoing', getOutgoingTransactions);

module.exports = router;
