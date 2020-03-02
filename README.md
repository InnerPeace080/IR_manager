# ACI (AirConditioner caculate IRCode)

ACI is api for caculate IRcode for Airconditioner(SHARP and anything AC). Its ensemble of small modules work together to do that.

## Getting started

- Install [Node.js](https://nodejs.org/download/)
- clone source form [github](https://github.com/MinhWalker/IR_manager)

## Options

```bash
-base64toBufferArray(base64Str)           convert base64 to Buffer array
-BufferArraytoBase64(BufferArray)         convert BufferArray to base64
-convertIRCode(data_modulation, ByteMap)  caculate IRCode
```
## Setup


This module using [atob](https://www.npmjs.com/package/atob) and [btoa](https://www.npmjs.com/package/btoa) method , so you need to require to your project.


### Example

```javascript
const {TYPEs, OPTs, IRManager} = require('IR_manager');

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

var transportArr=IRManager.convertBase64Obj2Array(transport2);

var data2Send = IRManager.processData2Send(transportArr.byteMap, values)

var pulseArray = IRManager.convertIRCode(data2Send, transportArr.modulation )

console.log(IRManager.uInt16ArraytoBase64(pulseArray))

```
