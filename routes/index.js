const express = require("express");
const router = express.Router();

const btcRoutes = require("./bitcoinRoutes");
const ethRoutes = require("./ethereumRoutes");


router.use('/btc', btcRoutes);
router.use('/eth', ethRoutes);


module.exports = router;
