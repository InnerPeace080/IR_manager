var ir = require('./index');
var fs = require('fs');
var rawdata = fs.readFileSync('data.json');
var data = JSON.parse(rawdata);
var data_prm = data.prm;


console.log(ir.getIR_unfix(data_prm));
console.log(ir.getArrByte(test, [18, 0, 3, 0]));
console.log(ir.renderChecksum([7,0,1], [32,48,80,112]));

console.log(ir.base64toHEX("QAAARQEA"));

