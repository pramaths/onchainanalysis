const { transformBitcoinTransaction } = require('../../services/blockchain/Bitcoin/transaction');

describe('Bitcoin Transaction Transformation', () => {
  const address = "bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv89c";

  test('handles transaction with empty vin array correctly', () => {
    const transaction = {
      txid: "dbaae52a7346b60700303ee4a02418eaffa87c4c71ea5e5a05533a7d98ba2813",
      prevout: {
        scriptpubkey: "0014857f3f59abc3998e771f07d8f06d3ec6eb5d2da2",
        scriptpubkey_asm: "OP_0 OP_PUSHBYTES_20 857f3f59abc3998e771f07d8f06d3ec6eb5d2da2",
        scriptpubkey_type: "v0_p2wpkh",
        scriptpubkey_address: "bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv88c",
        value: 187703
      },
      vout: [{
        scriptpubkey: "0014857f3f59abc3998e771f07d8f06d3ec6eb5d2da2",
        scriptpubkey_address: "bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv87c",
        value: 500698
      }],
      status: {
        block_time: "1719753054"
      }
    };

    const expectedOutput = [
      {
        block_hash: "",
        block_number: "",
        block_timestamp: "",
        from_address: "bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv88c",
        to_address: address,
        value: 500698,
        txid: "dbaae52a7346b60700303ee4a02418eaffa87c4c71ea5e5a05533a7d98ba2813",
        block_time: "1719753054"
      },
      {
       "block_hash": "",
       "block_number": "",
       "block_time": "1719753054",
       "block_timestamp": "",
       "from_address": "bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv89c",
       "to_address": "bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv87c",
       "txid": "dbaae52a7346b60700303ee4a02418eaffa87c4c71ea5e5a05533a7d98ba2813",
       "value": 500698,
     },
    ];
    console.log("+++",transformBitcoinTransaction(transaction, address));
    expect(transformBitcoinTransaction(transaction, address)).toEqual(expectedOutput);
  });

  test('handles transactions where input and output addresses match the provided address', () => {
    const transaction = {
      txid: "some_txid",
      vin: [{
        prevout: {
          scriptpubkey_address: address,
          value: 689949
        }
      }],
      vout: [{
        scriptpubkey_address: address,
        value: 689949
      }],
      status: {
        block_time: 1719753054
      }
    };

    const expectedOutput = [];
    expect(transformBitcoinTransaction(transaction, address)).toEqual(expectedOutput);
  });

  test('excludes transactions where no address matches the provided address', () => {
    const transaction = {
      txid: "some_txid",
      vin: [{
        prevout: {
          scriptpubkey_address: "some_other_address",
          value: 500000
        }
      }],
      vout: [{
        scriptpubkey_address: "another_different_address",
        value: 500000
      }],
      status: {
        block_time: 1719753054
      }
    };

    const expectedOutput = [
      {
        block_hash: "",
        block_number: "",
        block_timestamp: "",
        from_address: "some_other_address",
        to_address: address,
        value: 500000,
        txid: "some_txid",
        block_time: 1719753054
      },
      {
        block_hash: "",
        block_number: "",
        block_timestamp: "",
        from_address: address,
        to_address: "another_different_address",
        value: 500000,
        txid: "some_txid",
        block_time: 1719753054
      }

    ];
    expect(transformBitcoinTransaction(transaction, "bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv89c")).toEqual(expectedOutput);
  });

  test('handles transactions with multiple outputs where one output address matches', () => {
    const transaction = {
      txid: "some_txid",
      vin: [{
        prevout: {
          scriptpubkey_address: "some_other_address",
          value: 689949
        }
      }],
      vout: [
        {
          scriptpubkey_address: "another_address",
          value: 300000
        },
        {
          scriptpubkey_address: address,
          value: 389949
        }
      ],
      status: {
        block_time: 1719753054
      }
    };

    const expectedOutput = [{
      block_hash: "",
      block_number: "",
      block_timestamp: "",
      from_address: "some_other_address",
      to_address: address,
      value: 689949,
      txid: "some_txid",
      block_time: 1719753054
    },
  {
    "block_hash": "",
    "block_number": "",
    "block_time": 1719753054,
    "block_timestamp": "",
    "from_address": address,
    "to_address": "another_address",
    "txid": "some_txid",
    "value": 300000,
  }
  ];
    expect(transformBitcoinTransaction(transaction, address)).toEqual(expectedOutput);
  });

  test('handles transactions with null or missing fields', () => {
    const transaction = {
      txid: "some_txid",
      vin: [{
      }],
      vout: [{
        scriptpubkey_address: address,
        value: 500698
      }],
      status: {
        block_time: 1719753054
      }
    };

    const expectedOutput = [];
    expect(transformBitcoinTransaction(transaction, address)).toEqual(expectedOutput);
  });

});
