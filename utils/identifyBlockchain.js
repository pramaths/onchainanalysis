function identifyBlockchain(address) {
  let result = {
      blockchain: '',
      network: '',
      networkCode: ''
  };

  if ((address.startsWith('1') || address.startsWith('3') || address.startsWith('bc1')) && (address.length >= 26 && address.length <= 42)) {
      result.blockchain = 'Bitcoin (BTC)';
      result.network = 'Mainnet';
      result.networkCode = 'BTC';
  } else if (address.startsWith('0x') && address.length === 42) {
      result.blockchain = 'Ethereum';
      result.network = 'ETH_MAINNET';
      result.networkCode = '0x1/0x38';
  } else if ((address.startsWith('L') || address.startsWith('M') || address.startsWith('ltc1')) && (address.length >= 26 && address.length <= 35)) {
      result.blockchain = 'Litecoin (LTC)';
      result.network = 'Mainnet';
      result.networkCode = 'LTC';
  } else if ((address.startsWith('q') || address.startsWith('p')) && address.length === 42) {
      result.blockchain = 'Bitcoin Cash (BCH)';
      result.network = 'Mainnet';
      result.networkCode = 'BCH';
  } else if (address.startsWith('r') && address.length === 34) {
      result.blockchain = 'Ripple (XRP)';
      result.network = 'Mainnet';
      result.networkCode = 'XRP';
  } else if ((address.startsWith('DdzFF') || address.startsWith('Ae2')) && address.length >= 52 && address.length <= 104) {
      result.blockchain = 'Cardano (ADA)';
      result.network = 'Mainnet';
      result.networkCode = 'ADA';
  } else if (address.startsWith('1') && address.length === 48) {
      result.blockchain = 'Polkadot (DOT)';
      result.network = 'Mainnet';
      result.networkCode = 'DOT';
  } else if (address.length === 44 && /^[A-Za-z0-9]+$/.test(address)) {
      result.blockchain = 'Solana (SOL)';
      result.network = 'Mainnet';
      result.networkCode = 'SOL';
  } else if (address.startsWith('T') && address.length === 34) {
      result.blockchain = 'Tron (TRX)';
      result.network = 'Mainnet';
      result.networkCode = 'TRX';
  } else if (address.startsWith('G') && address.length === 56) {
      result.blockchain = 'Stellar (XLM)';
      result.network = 'Mainnet';
      result.networkCode = 'XLM';
  } else if (address.length === 12 && /^[a-z0-9.]+$/.test(address)) {
      result.blockchain = 'EOS (EOS)';
      result.network = 'Mainnet';
      result.networkCode = 'EOS';
  } else if (address.startsWith('tz') && address.length === 36) {
      result.blockchain = 'Tezos (XTZ)';
      result.network = 'Mainnet';
      result.networkCode = 'XTZ';
  } else if (address.startsWith('4') && address.length === 95) {
      result.blockchain = 'Monero (XMR)';
      result.network = 'Mainnet';
      result.networkCode = 'XMR';
  } else if ((address.startsWith('X-') || address.startsWith('P-') || address.startsWith('C-')) && address.length >= 35 && address.length <= 43) {
      result.blockchain = 'Avalanche (AVAX)';
      result.network = 'Mainnet';
      result.networkCode = 'AVAX';
  } else if (address.startsWith('cosmos') && address.length === 45) {
      result.blockchain = 'Cosmos (ATOM)';
      result.network = 'Mainnet';
      result.networkCode = 'ATOM';
  } else if ((address.startsWith('A') && address.length === 58) || (address.startsWith('A') && address.length === 34)) {
      result.blockchain = 'Algorand (ALGO) or NEO (NEO)';
      result.network = 'Mainnet';
      result.networkCode = 'ALGO/NEO';
  } else if (address.startsWith('zil') && address.length === 42) {
      result.blockchain = 'Zilliqa (ZIL)';
      result.network = 'Mainnet';
      result.networkCode = 'ZIL';
  } else if (address.startsWith('one') && address.length === 42) {
      result.blockchain = 'Harmony (ONE)';
      result.network = 'Mainnet';
      result.networkCode = 'ONE';
  } else if ((address.startsWith('D') || address.startsWith('S') || address.startsWith('dgb1')) && (address.length >= 26 && address.length <= 35)) {
      result.blockchain = 'DigiByte (DGB)';
      result.network = 'Mainnet';
      result.networkCode = 'DGB';
  } else {
      result.blockchain = 'Unknown address format';
      result.network = 'Unknown';
      result.networkCode = 'Unknown';
  }

  return result;
}


function identifyBlockchainByHash(hash) {
    let result = {
        blockchain: '',
        network: '',
        networkCode: ''
    };

    if (hash.startsWith('0x') && hash.length === 66) {
        result.blockchain = 'Ethereum';
        result.network = 'ETH_MAINNET';
        result.networkCode = '0x1/0x38';
    } else if (hash.length === 64) {
        result.blockchain = 'Bitcoin/Litecoin/others';
        result.network = 'Mainnet';
        result.networkCode = 'BTC/LTC/others';
    } else if (hash.startsWith('0x') && hash.length === 64) {
        result.blockchain = 'Custom Blockchain';
        result.network = 'Custom_MAINNET';
        result.networkCode = 'Custom';
    } else {
        result.blockchain = 'Unknown or unsupported hash format';
        result.network = 'Unknown';
        result.networkCode = 'Unknown';
    }

    return result;
}


module.exports = {  identifyBlockchain, identifyBlockchainByHash };