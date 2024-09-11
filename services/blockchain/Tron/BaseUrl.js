const apiKey = '9788928a-bbdb-44b7-96d7-0ba1198200d1';
const endpoint = 'https://apilist.tronscanapi.com/api';

function tronSDK() {
    return {
        get: (url) => {
            return fetch(endpoint + url, {
                headers: {
                    'TRON-PRO-API-KEY': apiKey
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            });
        }
    };
}

module.exports = { tronSDK, endpoint };