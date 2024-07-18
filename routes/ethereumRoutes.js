const express = require("express");
const router = express.Router();

const {
  getTransactions,
} = require("../controllers/eth/transactionController");
const {
  getBalance,
} = require("../services/blockchain/Ethereum/EvmChain/address");
const {
  getNormalTransactions,
} = require("../services/blockchain/Ethereum/EvmChain/transaction");
const { getEthBalance } = require("../services/blockchain/Ethereum/EvmChain/address");
const {
  getTransactionDetails,
} = require("../controllers/eth/txHashController");


router.get("/address/:address/:pagesize?", getTransactions);
router.get("/:chain/txhash/:txhash", getTransactionDetails);
router.get("/evmchain/transactions/:address", getNormalTransactions);
router.get("/address/:address/", getEthBalance);

module.exports = router;
