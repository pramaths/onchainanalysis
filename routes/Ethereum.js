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
} = require("../controllers/eth/txHashController");


router.get("/eth/:chain/:address/:pagesize?", getWalletTransactions);
router.get("/arb/:address", getArbTrans);
router.get("/:chain/txhash/:txhash", getTransactionDetails);
router.get("/evmchain/transactions/:address", getNormalTransactions);
router.get("/evmchain/:address/", getEthBalance);

module.exports = router;
