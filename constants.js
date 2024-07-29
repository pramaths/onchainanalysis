const BATCH_SIZE = 50;
const BATCH_DELAY = 5000; 
const MIN_BTC_VALUE = 0.0001;
const WEI_PER_ETHER = 10 ** 18;
const SATOSHI_PER_BITCOIN = 10 ** 8;

const CHAIN_UNITS = {
    eth:{
        name: "ether",
        symbol: "ETH",
        MIN_VALUE: 1e18,
        MIN_ETH_VALUE: 1
    },
    bsc:{
        name: "Binance Coin",
        symbol: "BNB",
        MIN_VALUE: 1e18,
        MIN_BNB_VALUE: 10
    },
    matic:{
        name: "Matic",
        symbol: "MATIC",
        MIN_VALUE: 1e18,
        MIN_MATIC_VALUE: 1000
    },
    trx:{
        name: "Tron",
        symbol: "TRX",
        value: 1e6,
        MIN_TRX_VALUE: 100000
    },
    ada:{
        name: "Cardano",
        symbol: "ADA",
        value: 1e6
    },
    xrp:{
        name: "Ripple",
        symbol: "XRP",
        value: 1e6
    },
    dot:{
        name: "Polkadot",
        symbol: "DOT",
        value: 1e10
    },
    sol:{
        name: "Solana",
        symbol: "SOL",
        value: 1e9
    }
};



module.exports = { BATCH_SIZE, BATCH_DELAY, MIN_BTC_VALUE, WEI_PER_ETHER, SATOSHI_PER_BITCOIN, CHAIN_UNITS };