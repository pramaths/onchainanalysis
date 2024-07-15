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
const { getEthBalance } = require("../services/blockchain/Ethereum/EvmChain/address");
const { getArbTrans } = require("../services/blockchain/Ethereum/arbitrum");
const {
  getTransactionDetails,
} = require("../services/blockchain/Ethereum/transaction");

const {txHashdetails} = require("../services/blockchain/Ethereum/EvmChain/txhash");

router.get("/eth/:chain/:address/:pagesize?", getWalletTransactions);
router.get("/arb/:address", getArbTrans);
router.get("/transaction/:hash", getTransactionDetails);
router.get("/evmchain/transactions/:address", getNormalTransactions);
router.get("/evmchain/:address/", getEthBalance);
router.get("/evmchain/txhash/:txhash", txHashdetails);

module.exports = router;
