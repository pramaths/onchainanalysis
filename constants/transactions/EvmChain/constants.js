// chain names and chain ids and routes urls

const etherscan = `https://api.etherscan.io/`
const polygonscan = `https://api.polygonscan.com/`
const bscscan = `https://api.bscscan.com/`
const ftmscan = `https://api.ftmscan.com/`
const arbiscan = `https://api.arbiscan.com/`
const basescan = `https://api.basescan.io/`
const snowscan = `https://api.snowscan.xyz.io/`
const lineascan = `https://api.lineascan.io/`
const gnosisscan = `https://api.gnosisscan.io/`
const OptimisticEtherscan = `https://api-optimistic.etherscan.io/`

const explorers = [
    { name: "Etherscan", chainId: 1 },
    // { name: "Goerli Etherscan", chainId: 5 },   testnets
    // { name: "Sepolia Etherscan", chainId: 11155111 },
    { name: "Holesky Etherscan", chainId: 17000 },
    { name: "BscScan", chainId: 56 },
    { name: "opBNB BscScan", chainId: 204 },
    { name: "FTMScan", chainId: 250 },
    { name: "Optimistic Etherscan", chainId: 10 },
    { name: "PolygonScan", chainId: 137 },
    { name: "Arbiscan", chainId: 42161 },
    { name: "Moonbeam Moonscan", chainId: 1284 },
    { name: "Moonriver Moonscan", chainId: 1285 },
    { name: "BTTCScan", chainId: 199 },
    { name: "CeloScan", chainId: 42220 },
    { name: "GnosisScan", chainId: 100 },
    { name: "BaseScan", chainId: 8453 },
    { name: "zkEVM PolygonScan", chainId: 1101 },
    { name: "LineaScan", chainId: 59144 },
    { name: "ScrollScan", chainId: 534352 },
    { name: "WemixScan", chainId: 1111 },
    { name: "KromaScan", chainId: 255 },
    { name: "Fraxscan", chainId: 252 },
    { name: "SnowScan", chainId: 43114 },
    { name: "BlastScan", chainId: 81457 },
];


const urls = explorers.map(explorer => `https://${explorer.name.replace(/ /g, '').toLowerCase()}/api`);

console.log(urls);
