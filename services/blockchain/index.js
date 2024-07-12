const { identifyBlockchain, identifyBlockchainByHash } = require('./utils/identifyBlockchain');
const logger = require('./utils/logger');

function routeBlockchainInput(type, input) {
    let result;

    if (type === 'hash') {
        logger.log('Processing input as a transaction hash');
        result = identifyBlockchainByHash(input);
    } else if (type === 'address') {
        logger.log('Processing input as an address');
        result = identifyBlockchain(input);
    } else {
        logger.error('Invalid type specified. Must be "hash" or "address".');
        result = {
            blockchain: 'Invalid input type',
            network: 'Error',
            networkCode: 'Invalid Type'
        };
    }

    return result;
}
