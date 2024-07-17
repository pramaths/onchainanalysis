// const { transformBitcoinTransaction } = require('../../services/blockchain/Bitcoin/transaction');
const {transformBitcoinTransaction}=require('../../serializers/btcSerializer')

// describe('Bitcoin Transaction Transformation', () => {
//   const address = "bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv89c";

//   test('handles transaction with empty vin array correctly', () => {
//     const transaction = {
//       txid: "dbaae52a7346b60700303ee4a02418eaffa87c4c71ea5e5a05533a7d98ba2813",
//       prevout: {
//         scriptpubkey: "0014857f3f59abc3998e771f07d8f06d3ec6eb5d2da2",
//         scriptpubkey_asm: "OP_0 OP_PUSHBYTES_20 857f3f59abc3998e771f07d8f06d3ec6eb5d2da2",
//         scriptpubkey_type: "v0_p2wpkh",
//         scriptpubkey_address: "bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv88c",
//         value: 187703
//       },
//       vout: [{
//         scriptpubkey: "0014857f3f59abc3998e771f07d8f06d3ec6eb5d2da2",
//         scriptpubkey_address: "bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv87c",
//         value: 500698
//       }],
//       status: {
//         block_time: "1719753054"
//       }
//     };

//     const expectedOutput = [
//       {
//         block_hash: "",
//         block_number: "",
//         block_timestamp: "",
//         from_address: "bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv88c",
//         to_address: address,
//         value: 500698,
//         txid: "dbaae52a7346b60700303ee4a02418eaffa87c4c71ea5e5a05533a7d98ba2813",
//         block_time: "1719753054"
//       },
//       {
//        "block_hash": "",
//        "block_number": "",
//        "block_time": "1719753054",
//        "block_timestamp": "",
//        "from_address": "bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv89c",
//        "to_address": "bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv87c",
//        "txid": "dbaae52a7346b60700303ee4a02418eaffa87c4c71ea5e5a05533a7d98ba2813",
//        "value": 500698,
//      },
//     ];
//     console.log("+++",transformBitcoinTransaction(transaction, address));
//     expect(transformBitcoinTransaction(transaction, address)).toEqual(expectedOutput);
//   });

//   test('handles transactions where input and output addresses match the provided address', () => {
//     const transaction = {
//       txid: "some_txid",
//       vin: [{
//         prevout: {
//           scriptpubkey_address: address,
//           value: 689949
//         }
//       }],
//       vout: [{
//         scriptpubkey_address: address,
//         value: 689949
//       }],
//       status: {
//         block_time: 1719753054
//       }
//     };

//     const expectedOutput = [];
//     expect(transformBitcoinTransaction(transaction, address)).toEqual(expectedOutput);
//   });

//   test('excludes transactions where no address matches the provided address', () => {
//     const transaction = {
//       txid: "some_txid",
//       vin: [{
//         prevout: {
//           scriptpubkey_address: "some_other_address",
//           value: 500000
//         }
//       }],
//       vout: [{
//         scriptpubkey_address: "another_different_address",
//         value: 500000
//       }],
//       status: {
//         block_time: 1719753054
//       }
//     };

//     const expectedOutput = [
//       {
//         block_hash: "",
//         block_number: "",
//         block_timestamp: "",
//         from_address: "some_other_address",
//         to_address: address,
//         value: 500000,
//         txid: "some_txid",
//         block_time: 1719753054
//       },
//       {
//         block_hash: "",
//         block_number: "",
//         block_timestamp: "",
//         from_address: address,
//         to_address: "another_different_address",
//         value: 500000,
//         txid: "some_txid",
//         block_time: 1719753054
//       }

//     ];
//     expect(transformBitcoinTransaction(transaction, "bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv89c")).toEqual(expectedOutput);
//   });

  // test('handles transactions with multiple outputs where one output address matches', () => {
  //   const transaction = {
  //     txid: "some_txid",
  //     vin: [{
  //       prevout: {
  //         scriptpubkey_address: "some_other_address",
  //         value: 689949
  //       }
  //     }],
  //     vout: [
  //       {
  //         scriptpubkey_address: "another_address",
  //         value: 300000
  //       },
  //       {
  //         scriptpubkey_address: address,
  //         value: 389949
  //       }
  //     ],
  //     status: {
  //       block_time: 1719753054
  //     }
  //   };

  //   const expectedOutput = [{
  //     block_hash: "",
  //     block_number: "",
  //     block_timestamp: "",
  //     from_address: "some_other_address",
  //     to_address: address,
  //     value: 689949,
  //     txid: "some_txid",
  //     block_time: 1719753054
  //   },
  // {
  //   "block_hash": "",
  //   "block_number": "",
  //   "block_time": 1719753054,
  //   "block_timestamp": "",
  //   "from_address": address,
  //   "to_address": "another_address",
  //   "txid": "some_txid",
  //   "value": 300000,
  // }
  // ];
  //   expect(transformBitcoinTransaction(transaction, address)).toEqual(expectedOutput);
  // });

  test('handles transactions with null or missing fields', () => {
    const transaction = {
      txid: "some_txid",
      vin: [{
      }],
      // vout: [{
      //   scriptpubkey_address: address,
      //   value: 500698
      // }],
      status: {
        block_time: 1719753054
      }
    };

    const expectedOutput = [];
    expect(transformBitcoinTransaction(transaction, '37jKPSmbEGwgfacCr2nayn1wTaqMAbA94Z')).toEqual(expectedOutput);
  });

// });


//   test('handles transactions with multiple outputs and vin null', () => {
//     const transaction = {
//       "txid": "bbcec780ccfed2731d5e24cc84dce7ee95dbcf8955f38938dab3f25041d3d3da",
//       "version": 1,
//       "locktime": 0,
//       "vin": [
//         {
//           "txid": "0000000000000000000000000000000000000000000000000000000000000000",
//           "vout": 4294967295,
//           "prevout": null,
//           "scriptsig": "0398f90c194d696e656420627920416e74506f6f6c208c00120675bbe000fabe6d6df8ee6f07f20c76ed36bb2c187e7612521624e94f22220002e73e125ceae433c5100000000000000012c700000917000000000000",
//           "scriptsig_asm": "OP_PUSHBYTES_3 98f90c OP_PUSHBYTES_25 4d696e656420627920416e74506f6f6c208c00120675bbe000 OP_RETURN_250 OP_RETURN_190 OP_2DROP OP_2DROP OP_RETURN_248 OP_RETURN_238 OP_3DUP OP_PUSHBYTES_7 f20c76ed36bb2c OP_PUSHBYTES_24 7e7612521624e94f22220002e73e125ceae433c510000000 OP_0 OP_0 OP_0 OP_0 OP_PUSHBYTES_18 \u003Cpush past end\u003E",
//           "witness": [
//             "0000000000000000000000000000000000000000000000000000000000000000"
//           ],
//           "is_coinbase": true,
//           "sequence": 4294967295
//         }
//       ],
//       "vout": [
//         {
//           "scriptpubkey": "a91442402a28dd61f2718a4b27ae72a4791d5bbdade787",
//           "scriptpubkey_asm": "OP_HASH160 OP_PUSHBYTES_20 42402a28dd61f2718a4b27ae72a4791d5bbdade7 OP_EQUAL",
//           "scriptpubkey_type": "p2sh",
//           "scriptpubkey_address": "37jKPSmbEGwgfacCr2nayn1wTaqMAbA94Z",
//           "value": 546
//         },
//         {
//           "scriptpubkey": "a9145249bdf2c131d43995cff42e8feee293f79297a887",
//           "scriptpubkey_asm": "OP_HASH160 OP_PUSHBYTES_20 5249bdf2c131d43995cff42e8feee293f79297a8 OP_EQUAL",
//           "scriptpubkey_type": "p2sh",
//           "scriptpubkey_address": "39C7fxSzEACPjM78Z7xdPxhf7mKxJwvfMJ",
//           "value": 320302490
//         },
//         {
//           "scriptpubkey": "6a24aa21a9ed87b21c65cf2eb277f4fa457dcb60550dbedebbee60247e8b453ff042ef2d6598",
//           "scriptpubkey_asm": "OP_RETURN OP_PUSHBYTES_36 aa21a9ed87b21c65cf2eb277f4fa457dcb60550dbedebbee60247e8b453ff042ef2d6598",
//           "scriptpubkey_type": "op_return",
//           "value": 0
//         },
//         {
//           "scriptpubkey": "6a2d434f524501a37cf4faa0758b26dca666f3e36d42fa15cc01064e3ecda72cb7961caa4b541b1e322bcfe0b5a030",
//           "scriptpubkey_asm": "OP_RETURN OP_PUSHBYTES_45 434f524501a37cf4faa0758b26dca666f3e36d42fa15cc01064e3ecda72cb7961caa4b541b1e322bcfe0b5a030",
//           "scriptpubkey_type": "op_return",
//           "value": 0
//         },
//         {
//           "scriptpubkey": "6a2952534b424c4f434b3a2691d11eb6fddf59deba3102bbbecae91d81a13d11a0b308ef6ca7220062f4ab",
//           "scriptpubkey_asm": "OP_RETURN OP_PUSHBYTES_41 52534b424c4f434b3a2691d11eb6fddf59deba3102bbbecae91d81a13d11a0b308ef6ca7220062f4ab",
//           "scriptpubkey_type": "op_return",
//           "value": 0
//         }
//       ],
//       "size": 392,
//       "weight": 1460,
//       "fee": 0,
//       "status": {
//         "confirmed": true,
//         "block_height": 850328,
//         "block_hash": "00000000000000000002fcc4eaf2a5d799e8d10d323819a639757bc74789779e",
//         "block_time": 1719896456
//       }
//     }

//     const expectedOutput = [{
//       block_hash: "",
//       block_number: "",
//       block_timestamp: "",
//       from_address: "37jKPSmbEGwgfacCr2nayn1wTaqMAbA94Z",
//       to_address: '39C7fxSzEACPjM78Z7xdPxhf7mKxJwvfMJ',
//       value: 320302490,
//       txid: "bbcec780ccfed2731d5e24cc84dce7ee95dbcf8955f38938dab3f25041d3d3da",
//       block_time: 1719896456
//     }
//   ];
//     expect(transformBitcoinTransaction(transaction, '37jKPSmbEGwgfacCr2nayn1wTaqMAbA94Z')).toEqual(expectedOutput);
//   });




