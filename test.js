const {TYPEs, OPTs, IRManager} = require('./index.js');

var transport = {
  byteMap: [170, 90, 207, 16, {
    input: [{
      name: 'tem',
      mapping: [
        [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
      ]
    }]
  }, {
    input: [{
      name: 'pwr',
      mapping: [
        [0, 1],
        [33, 49]
      ]
    }]
  }, {
    input: [{
      name: 'mod',
      mapping: [
        [1, 2, 3, 4, 5],
        [0, 1, 2, 3, 4]
      ]
    },
    {
      name: 'fan',
      mapping: [
        [0, 1, 2, 3],
        [32, 48, 80, 112]
      ]
    }
    ],
    opt: [0, 5, 0, 1]
  }, 0, 8, 128, 0, 240,
  {
    opt: [50, 0, 0, 0,
      50, 0, 0, 1,
      37, 7, 0, 1,
      18, 0, 2, 0,
      34, 21, 1, 1,
      35, 16, 1, 12,
      51, 19, 2, 0,
      51, 20, 0, 0,
      35, 7, 0, 1,
      35, 8, 0, 4,
      17, 7, 8, 9,
      19, 4, 10, 15,
      19, 9, 11, 4,
      19, 5, 12, 1]
  }
  ],
  modulation: {
    type: 1,
    table: [ [470, 470, 3840, 470], [471, 1400, 1920, 0] ],
    conv: [0, 2, 1, 1, 0, 13, 0, 3, 1]
  }
};

var temp1 =IRManager.decodeOpt(IRManager.base64toBufferArray('MgAAADIA9AFSAgABEgACASIVAAAjEAAaMxMCADMUAAAhAAEI'));

console.log(temp1);

console.log(IRManager.encodeOpt(temp1));

var transport2 = {
  byteMap: [170, 90, 207, 16, {
    input: [{
      name: 'tem',
      mapping: ['EhMUFRYXGBkaGxwdHg==', 'AQIDBAUGBwgJCgsMDQ==']
    }]
  }, {
    input: [{
      name: 'pwr',
      mapping: ['AAE=', 'ITE=']
    }]
  }, {
    input: [{
      name: 'mod',
      mapping: ['AQIDBAU=', 'AAECAwQ=']
    }, {
      name: 'fan',
      mapping: ['AAECAw==', 'IDBQcA==']
    }],
    opt: 'AAUAAQ=='
  }, 0, 8, 128, 0, 240, {
    opt: 'MgAAADIAAAElBwABEgACACIVAQEjEAEMMxMCADMUAAAjBwABIwgABBEHCAkTBAoPEwkLBBMFDAE='
  }],
  modulation: {
    type: 1,
    table: ['1gHWAQAP1gE=', '1wF4BYAHAAA='],
    conv: 'AAIBAQANAAMB'
  }
};

var values = {
  pwr: 0,
  mod: 3,
  fan: 3,
  tem: 24,
  swV: 0,
  swH: 0
};

// results
// 170--90--207--16--7--33--114--0--8--128--0--240--33--


var transportArr=IRManager.convertBase64Obj2Array(transport2);
// console.log('transport', transport.modulation.table);
// console.log('transportArr', transportArr.modulation.table);

console.log(IRManager.processData2Send(transportArr.byteMap, values));
// console.log(IRManager.convertIRCode(IRManager.processData2Send(transport.byteMap, values), transport.modulation ) );

var ret = IRManager.check_IRcode(IRManager.convertIRCode(IRManager.processData2Send(transportArr.byteMap, values), transportArr.modulation ).toString()
  .split(',')
  .join('    '),
'3840   1920    470    471    470   1400    470    471    470   1400    470    471 \
470   1400    470    471    470   1400    470    471    470   1400    470    471 \
470   1400    470   1400    470    471    470   1400    470    471    470   1400 \
470   1400    470   1400    470   1400    470    471    470    471    470   1400 \
470   1400    470    471    470    471    470    471    470    471    470   1400 \
470    471    470    471    470    471    470   1400    470   1400    470   1400 \
470    471    470    471    470    471    470    471    470    471    470   1400 \
470    471    470    471    470    471    470    471    470   1400    470    471 \
470    471    470    471    470   1400    470    471    470    471    470   1400 \
470   1400    470   1400    470    471    470    471    470    471    470    471 \
470    471    470    471    470    471    470    471    470    471    470    471 \
470    471    470    471    470   1400    470    471    470    471    470    471 \
470    471    470    471    470    471    470    471    470    471    470    471 \
470    471    470    471    470   1400    470    471    470    471    470    471 \
470    471    470    471    470    471    470    471    470    471    470    471 \
470    471    470    471    470    471    470   1400    470   1400    470   1400 \
470   1400    470   1400    470    471    470    471    470    471    470    471 \
470   1400    470    471    470    471    470  0');

console.log('ret', ret);

// var pulseArray = IRManager.convertIRCode(IRManager.processData2Send(transportArr.byteMap, values), transportArr.modulation );
// console.log('pulseArray', pulseArray);
// console.log(IRManager.uInt16ArraytoBase64(pulseArray));
