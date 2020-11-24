/*eslint-disable no-console*/

const {TYPEs, OPTs, IRManager} = require('./index.js');

// var transport = {
//   byteMap: [170, 90, 207, 16, {
//     input: [{
//       name: 'tem',
//       mapping: [
//         [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
//         [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
//       ]
//     }]
//   }, {
//     input: [{
//       name: 'pwr',
//       mapping: [
//         [0, 1],
//         [33, 49]
//       ]
//     }]
//   }, {
//     input: [{
//       name: 'mod',
//       mapping: [
//         [1, 2, 3, 4, 5],
//         [0, 1, 2, 3, 4]
//       ]
//     },
//     {
//       name: 'fan',
//       mapping: [
//         [0, 1, 2, 3],
//         [32, 48, 80, 112]
//       ]
//     }
//     ],
//     opt: [0, 5, 0, 1]
//   }, 0, 8, 128, 0, 240,
//   {
//     opt: [50, 0, 0, 0,
//       50, 0, 0, 1,
//       37, 7, 0, 1,
//       18, 0, 2, 0,
//       34, 21, 1, 1,
//       35, 16, 1, 12,
//       51, 19, 2, 0,
//       51, 20, 0, 0,
//       35, 7, 0, 1,
//       35, 8, 0, 4,
//       17, 7, 8, 9,
//       19, 4, 10, 15,
//       19, 9, 11, 4,
//       19, 5, 12, 1]
//   }
//   ],
//   modulation: {
//     type: 1,
//     table: [ [470, 470, 3840, 470], [471, 1400, 1920, 0] ],
//     conv: [0, 2, 1, 1, 0, 13, 0, 3, 1]
//   }
// };
//
// var temp1 =IRManager.decodeOpt(IRManager.base64toBufferArray('MgAAADIA9AFSAgABEgACASIVAAAjEAAaMxMCADMUAAAhAAEI'));
//
// console.log(temp1);
//
// console.log(IRManager.encodeOpt(temp1));

var transport2 = {
  modulation: {
    table: [
      'fAF8Ac4TfAF8AQ==',
      'sgLgBkgIPHMAAA=='
    ],
    type: 1,
    conv: 'AAIBAQAHAAMBAAIBAQcPAAQB'
  },
  byteMap: [
    {
      input: [
        {
          name: 'mod',
          mapping: [
            'AQIDBAU=',
            'c3NzI2M='
          ]
        }
      ]
    },
    {
      input: [
        {
          name: 'btn',
          mapping: [
            'AAECAwQF',
            'AAQAAAAA'
          ]
        }
      ]
    },
    {
      input: [
        {
          name: 'mod',
          mapping: [
            'AQIDBAU=',
            'AgICBwA='
          ]
        },
        {
          name: 'pwr',
          mapping: [
            'AAE=',
            'AAE='
          ]
        }
      ],
      opt: 'AwkABBAFAAE='
    },
    0,
    0,
    {
      input: [
        {
          name: 'tem',
          mapping: [
            'EBESExQVFhcYGRobHB0eHyA=',
            'DhASFBYYGhweICIkJigqLC4='
          ]
        },
        {
          name: 'mod',
          mapping: [
            'AQIDBAU=',
            'AQEBAAA='
          ]
        }
      ],
      opt: 'AgAAAAMNAQAyABAAMxQAACEAAAQ='
    },
    {
      input: [
        {
          name: 'fan',
          mapping: [
            'AAECAwQF',
            'EDAwMDAw'
          ]
        },
        {
          name: 'swv',
          mapping: [
            'AAECAwQFBg==',
            'BgUFBQUFBQ=='
          ]
        }
      ],
      opt: 'AAUAAQ=='
    },
    0,
    32,
    {
      opt: 'MgAHADIAAAFSAgABEgACASIVAAAjEAAVMxMCADMUAAAhAAEI'
    }
  ]
};

var values = {
  pwr: 1, mod: 3, mode: 3, fan: 0,
  tem: 26, swv: 4, swh: 2, btn: 1
};

// results
// 2--20--E0--4--0--0--0--6--2--20--E0--4--0--39--34--80--A3--6--0--E--E0--0--0--89--0--0--13--

const result = [2, 32, 224, 4, 0, 0, 0, 6, 2, 32, 224, 4, 0, 57, 52, 128, 163, 6, 0, 14, 224, 0, 0, 137, 0, 0, 19];

var transportArr=IRManager.convertBase64Obj2Array(transport2);
// console.log('transportArr', transportArr.modulation.table);
// console.log('transportArr', JSON.stringify(transportArr.byteMap[14]) );
// console.log(IRManager.processData2Send(transportArr.byteMap, values).map((c, i)=>`${i} : ${c} ?= ${result[i]} ::: ${JSON.stringify(transportArr.byteMap[i])}`));

// console.log('=====================');
// console.log(IRManager.processByte(transportArr.byteMap[16], values));

// console.log(IRManager.convertIRCode(IRManager.processData2Send(transportArr.byteMap, values), transportArr.modulation ) );

console.log(IRManager.processData2Send(transportArr.byteMap, values));
// console.log(IRManager.convertIRCode(IRManager.processData2Send(transportArr.byteMap, values), transportArr.modulation ));

// var ret = IRManager.check_IRcode(IRManager.convertIRCode(IRManager.processData2Send(transportArr.byteMap, values), transportArr.modulation ).toString()
//   .split(',')
//   .join('    '),
// '3500   1800    420    470    420   1350    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420   1350    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420   1350    420   1350    420   1350    420    470    420    470    420   1350    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420   1350    420   1350    420    470    420    470    420    470    420    470    420    470    420  10000   3500   1800    420    470    420   1350    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420   1350    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420   1350    420   1350    420   1350    420    470    420    470    420   1350    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420   1350    420    470    420    470    420   1350    420   1350    420   1350    420    470    420    470    420    470    420    470    420   1350    420    470    420   1350    420   1350    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420   1350    420   1350    420   1350    420    470    420    470    420    470    420   1350    420    470    420   1350    420    470    420   1350    420   1350    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420   1350    420   1350    420   1350    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420   1350    420   1350    420   1350    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420   1350    420    470    420    470    420   1350    420    470    420    470    420    470    420   1350    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420    470    420   1350    420   1350    420    470    420    470    420   1350    420    470    420    470    420    470    420   32767');
//
// console.log('ret', ret);
// //
// var pulseArray = IRManager.convertIRCode(IRManager.processData2Send(transportArr.byteMap, values), transportArr.modulation );
// console.log('pulseArray', pulseArray[437], pulseArray[438], pulseArray[439]);
// // console.log(IRManager.uInt16ArraytoBase64(pulseArray));
