const BATCH_SIZE = 50;
const BATCH_DELAY = 5000; 
const MIN_BTC_VALUE = 1;
const WEI_PER_ETHER = 10 ** 18;
const SATOSHI_PER_BITCOIN = 10 ** 8;

const CHAIN_UNITS = {
    eth: 1e18,  // Ethereum
    bsc: 1e18,  // Binance Smart Chain
    matic: 1e18, // Polygon (MATIC)
    btc: 1e8,    // Bitcoin
    trx: 1e6,    // Tron uses 'sun', where 1 TRX = 1e6 sun
    ada: 1e6,    // Cardano uses 'Lovelace', where 1 ADA = 1e6 Lovelace
    xrp: 1e6,    // Ripple uses 'drops', where 1 XRP = 1e6 drops
    dot: 1e10,   // Polkadot uses 'Plancks', where 1 DOT = 1e10 Plancks
    sol: 1e9     // Solana uses 'lamports', where 1 SOL = 1e9 lamports
};



module.exports = { BATCH_SIZE, BATCH_DELAY, MIN_BTC_VALUE, WEI_PER_ETHER, SATOSHI_PER_BITCOIN, CHAIN_UNITS };