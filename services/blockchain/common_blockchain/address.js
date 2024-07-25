const axios = require('axios');
const {addressSerializer} = require('../../../serializers/addressSerializer');


const fetchaddressDetails = async (address, chain) => {
    try {
        headers = {
            'OK-ACCESS-KEY': process.env.OKLINK_ACCESS_KEY,

          }
        const response = await axios.get(`https://www.oklink.com/api/v5/explorer/address/address-summary?chainShortName=${chain}&address=${address}`, {headers});
        
        const addressDetails = response.data.data.map((addressDeets) => addressSerializer(addressDeets, chain));
        return addressDetails;
        // return response.data.data
    } catch (error) {
        console.error('Error fetching address details:', error);
        return null;
    }
}

module.exports = {
    fetchaddressDetails
}