var ir = require('./index');
var fs = require('fs');
var rawdata = fs.readFileSync('data.json');
var data = JSON.parse(rawdata);
var data_prm = data.prm;


var test = ir.getIR_unfix(data_prm);
console.log(ir.getArrByte(test, [27,1,3,0]));
// console.log(ir.renderChecksum([129,0,0,138,0,11,135,1,1,136,2,4,7,2,3,132,4,5,137,5,4,133,6,1], ir.converArrHexToDec(ir.getArrByte(test, [27,1,3,0]))));
console.log(ir.checkSum(ir.converArrHexToDec(ir.getArrByte(test, [27,1,3,0]))));
// console.log(ir.base64toHEX("gQAAigALhwEBiAIEBwIDhAQPiQUEhQYB"));

