// etherscan returns the 100000 records of the latest transactions of the address --best for wallets

const etherscan = `https://api.etherscan.io/api?`

export const etherscan_tx_status =`${etherscan}module=transaction&action=getstatus&txhash=${txhash}&apikey=${api_key}`

export const etherscan_txlist = `${etherscan}
   ?module=account
   &action=txlist
   &address=${address}
   &startblock=0
   &endblock=99999999
   &page=1
   &offset=10000
   &sort=asc
   &apikey=${api_key}`


export const etherscan_txlistinternal = `${etherscan}module=account&action=txlistinternal&address=${address}&startblock=0&endblock=2702578
   &page=1
   &offset=10000
   &sort=asc
   &apikey=${api_key}`


