const express = require("express");
const router = express.Router();

const {
  getWalletTransactions,
} = require("../services/blockchain/Ethereum/transaction");
const {
  getBalance,
} = require("../services/blockchain/Ethereum/EvmChain/address");
const {
  getNormalTransactions,
} = require("../services/blockchain/Ethereum/EvmChain/transaction");
const { getArbTrans } = require("../services/blockchain/Ethereum/arbitrum");
const {
  getTransactionDetails,
} = require("../services/blockchain/Ethereum/transaction");

router.get("/eth/:chain/:address/:pagesize?", getWalletTransactions);
router.get("/arb/:address", getArbTrans);
router.get("/transaction/:hash", getTransactionDetails);
router.get("/evmchain/:address", getBalance);
router.get("/evmchain/transactions/:address", getNormalTransactions);

module.exports = router;
