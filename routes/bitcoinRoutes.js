const express = require('express');
const { getAllTransactionsController } = require('../services/blockchain/Bitcoin/transaction');
const {getAllTransactionsControllers} = require('../controllers/btc/transactionController');
const {getTxHashDetails} = require('../controllers/btc/txHashController');
const {getDetailsController} = require('../controllers/btc/addressController');
const router = express.Router();

// router.get('/address/:address', getDetailsController);
router.get('/address/:address', getAllTransactionsController);
router.get('/stream/transactions/:address', getAllTransactionsControllers);
router.get('/txhash/:txhash', getTxHashDetails );

module.exports = router;
