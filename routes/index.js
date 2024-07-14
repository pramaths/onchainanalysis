const express = require("express");
const router = express.Router();

const walletRoutes = require("./walletRoutes");
const transactionRoutes = require("./transactionRoutes");
// Add other route files similarly
// const someOtherRoutes = require("./someOtherRoutes");

router.use("/wallet", walletRoutes);
router.use("/transaction", transactionRoutes);
// Add other routes similarly
// router.use("/someOtherPath", someOtherRoutes);

module.exports = router;
