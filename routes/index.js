const express = require("express");
const router = express.Router();

const btcRoutes = require("./bitcoinRoutes");
const ethRoutes = require("./ethereumRoutes");
const tronRoutes = require("./tronRoutes");
const commonRoutes = require("./commonRoutes");

router.use('/btc', btcRoutes);
router.use('/trx', tronRoutes);
router.use('/', ethRoutes);
router.use('/crypto', commonRoutes);

module.exports = router;
