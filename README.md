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

```base
$ npm install
```

### Example

```javascript
var ir = require('./index');

// convert base64 to buffer array
const buf = ir.base64toBufferArray("AAECAw==");       //output: [ 0, 1, 2, 3 ]

// convert buffer array to base64
const base = ir.BufferArraytoBase64([0, 1, 2, 3]);    //output: 'AAECAw=='

// caculate IRCode
var data_m = data.m;    
/*
    "m": {
    "t": 1,
    "tb": ["1gHWAQAP1gE=", "1wF4BYAHAAA="],
    "c": "AAIBAQANAAMB"
    }
*/
var ByteMap = [170,90,207,16,10,49,34,0,8,128,0,240,177];   //example bytemap
const IRcode = ir.convertIRCode(data_m, ByteMap);   //output: [[3840,1920],[470,471,470,1400,470,471,470,1400,470,471,470,1400,470,471,470,1400].... ]

```


