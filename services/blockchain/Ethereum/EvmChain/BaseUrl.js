const etherscan = `https://api.etherscan.io/`;
const polygonscan = `https://api.polygonscan.com/`;
const bscscan = `https://api.bscscan.com/`;
const ftmscan = `https://api.ftmscan.com/`;
const arbiscan = `https://api.arbiscan.com/`;
const basescan = `https://api.basescan.io/`;
const snowscan = `https://api.snowscan.xyz.io/`;
const lineascan = `https://api.lineascan.io/`;
const gnosisscan = `https://api.gnosisscan.io/`;
const optimisticetherscan = `https://api-optimistic.etherscan.io/`;
const celoscan = `https://api.celoscan.io/`;
// const cronos

const explorers = [
    { name: "etherscan", chainId: 1, url: etherscan },
    { name: "bscscan", chainId: 56, url: bscscan },
    { name: "ftmScan", chainId: 250, url: ftmscan },
    { name: "Optimistic Etherscan", chainId: 10, url: optimisticetherscan },
    { name: "polygonscan", chainId: 137, url: polygonscan },
    { name: "arbiscan", chainId: 42161, url: arbiscan },
    { name: "celoscan", chainId: 42220, url: celoscan }, 
    { name: "gnosisscan", chainId: 100, url: gnosisscan },
    { name: "basescan", chainId: 8453, url: basescan },
    { name: "lineascan", chainId: 59144, url: lineascan },
    { name: "snowscan", chainId: 43114, url: snowscan },
];

const urls = explorers.map(explorer => explorer.url);

module.exports = { urls };