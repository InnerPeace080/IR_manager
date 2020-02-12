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
var atob = require('atob');
var btoa = require('btoa');
var fs = require('fs');
var ir = require('./index');

var rawdata = fs.readFileSync('data.json');
var data = JSON.parse(rawdata);


// convert base64 to buffer array
const buf = ir.base64toBufferArray("AAECAw==");       //output: [ 0, 1, 2, 3 ]

// convert buffer array to base64
const base = ir.BufferArraytoBase64([0, 1, 2, 3]);    //output: 'AAECAw=='

// caculate IRCode
/*
    "m": {
    "t": 1,
    "tb": ["1gHWAQAP1gE=", "1wF4BYAHAAA="],
    "c": "AAIBAQANAAMB"
    }
*/
const IRcode = ir.convertIRCode(data, map);   //map example: [27,1,3,0] for mapping
//output: [[3840,1920],[470,471,470,1400,470,471,470,1400,470,471,470,1400,470,471,470,1400].... ]

```


