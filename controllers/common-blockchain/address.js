const {fetchaddressDetails} = require('../../services/blockchain/common_blockchain/address');

const addressController = async (req, res) => {
    try {
        const {address, chain} = req.params;
        console.log(req.query);
        console.log('address:', address);
        console.log('chain:', chain);
       let formattedChain = chain.toUpperCase();
        const addressDetails = await fetchaddressDetails(address, formattedChain);
        res.status(200).json(addressDetails);
    } catch (error) {
        console.error('Error in addressController:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

module.exports = {
    addressController
}