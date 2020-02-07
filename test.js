var ir = require('./index');
var fs = require('fs');
var rawdata = fs.readFileSync('data.json');
var data = JSON.parse(rawdata);
var data_prm = data.prm;
var data_m = data.m;


var test = ir.getIR_unfix(data_prm);
console.log(ir.getArrByte(test, [27,1,3,0]));
console.log(ir.base64toBufferArray("AAECAw=="));
console.log(ir.BufferArraytoBase64([0, 1, 2, 3]));
// console.log(ir.convertIRCode(data_m, [170,90,207,16,10,49,34,0,8,128,0,240,177]));
// console.log(ir.converArrHexToDec(["AA","5A","CF","10","A","31","22","0","8","80","0","F0","B1"]));
// console.log(ir.renderChecksum([129,0,0,138,0,11,135,1,1,136,2,4,7,2,3,132,4,5,137,5,4,133,6,1], ir.converArrHexToDec(ir.getArrByte(test, [27,1,3,0]))));
// console.log(ir.checkSum(ir.converArrHexToDec(ir.getArrByte(test, [27,1,3,0]))));

