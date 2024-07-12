const etherscan = `https://api.etherscan.io/api`; 
const polygonscan = `https://api.polygonscan.com/api`;
const bscscan = `https://api.bscscan.com/api`;
const ftmscan = `https://api.ftmscan.com/api`;
const arbiscan = `https://api.arbiscan.com/api`;
const basescan = `https://api.basescan.io/api`;
const snowscan = `https://api.snowscan.xyz.io/api`;
const lineascan = `https://api.lineascan.io/`;
const gnosisscan = `https://api.gnosisscan.io/api`;
// const optimisticetherscan = `https://api-optimistic.etherscan.io/api`;
const celoscan = `https://api.celoscan.io/api`;
// const cronos

const explorersConfig = [
    { name: "etherscan", chainId: 1, url: etherscan },
    { name: "bscscan", chainId: 56, url: bscscan },
    { name: "ftmScan", chainId: 250, url: ftmscan },
    // { name: "Optimistic Etherscan", chainId: 10, url: optimisticetherscan},
    { name: "polygonscan", chainId: 137, url: polygonscan },
    { name: "arbiscan", chainId: 42161, url: arbiscan },
    { name: "celoscan", chainId: 42220, url: celoscan }, 
    { name: "gnosisscan", chainId: 100, url: gnosisscan },
    { name: "basescan", chainId: 8453, url: basescan },
    { name: "lineascan", chainId: 59144, url: lineascan },
    { name: "snowscan", chainId: 43114, url: snowscan },
];

const explorers = explorersConfig.map(explorer => explorer);

module.exports = { explorers };