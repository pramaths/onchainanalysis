const express = require("express");
const router = express.Router();

const btcRoutes = require("./bitcoinRoutes");
const ethRoutes = require("./ethereumRoutes");
const commonRoutes = require("./commonRoutes");

router.use('/btc', btcRoutes);
router.use('/eth', ethRoutes);
router.use('/crypto', commonRoutes);

module.exports = router;
