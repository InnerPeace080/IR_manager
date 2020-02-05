var atob = require('atob');
var btoa = require('btoa');
var fs = require('fs');

// define Ma lenh: 6bit
// 0:SETA
// 1:SETB
// 2:ADD
// 3:SUB
// 4:AND
// 5:OR
// 6:NOT
// 7:XOR
// 8:>>
// 9:<<
// 10:XORM
// 11 INVA 
// 12 INVB 
// 2bit cao:  bit6    	 bit7
// des: 0     A: C_idx	B: C_idx
//      1	   A: I_idx	B: const

//0: 170(AA) , 1: 90(5A), 2: 207(CF), 3: 16(10), 7: 0(00), 8: 8(08), 9: 128(80), 10: 0(00)

var rawdata = fs.readFileSync('data.json');
var data = JSON.parse(rawdata);
var data_prm = data.prm;

class IRGatewayManager {

    convert
    static convert(op, val) {
        switch(op) {
            case 'D2H': 
                if (val < 0) {
                    val = 0xFFFFFFFF + val + 1;
                }
                return val.toString(16).toUpperCase();
                break;
            case 'H2D':
                return parseInt(val, 16);
                break;
            case 'B2D':
                return parseInt(val, 2);
                break;
            case 'D2B':
                var bits = [];
                    for (var i = 0; i < 8; i++) {
                        bits.push(val % 2);
                        val = (val - val % 2) / 2;
                    }
                    bits.reverse();
                return bits.join("");
                break;
        }
    }

    static converArrHexToDec(arr) {
        let newArr = arr.map(x => {
            return IRGatewayManager.convert('H2D',x);
        })
        return newArr;
    }

    static convertArrDecToHex(arr) {
        let newArr = arr.map(x => {
            return IRGatewayManager.convert('D2H',x);
        })
        return newArr;
    }

    //base64 to byte array
    static base64toHEX(base64) {
        var raw = atob(base64);
        var HEX = [];
        for (let i = 0; i < raw.length; i++ ) {
        var _hex = raw.charCodeAt(i).toString(16)
        HEX.push(_hex.length==2?_hex:'0'+_hex);
        }
        return IRGatewayManager.converArrHexToDec(HEX);
    }

    static HextoBase64(hexstring) {
        return btoa(hexstring.match(/\w{2}/g).map(function(a) {
            return String.fromCharCode(parseInt(a, 16));
        }).join(""));
    }

    //get IR
    static getIR_unfix(arr) {
        let irUnfix;
        irUnfix = arr.filter(x => 
            typeof(x) === 'number'
        );
        return irUnfix;
    }

    static getIR_fix(arr) {
        let irFix;
        irFix = arr.filter(x => 
            typeof(x) === 'object'
        );
        return irFix;
    }

    //logical
    static logicalFunc(num, x, y) {
        switch(num) {
            case 2:
                return x + y; //ADD
                break;
            case 3:
                return x - y; //SUB
                break;
            case 4:
                return x & y; //AND
                break;
            case 5:
                return x | y; //OR
                break;
            case 6: 
                return !x;     //NOT
                break;
            case 7:
                return x ^ y;  //XOR
                break;
            case 8:
                return x >> y; //right shift
                break;
            case 9:
                return x << y; //left shift
                break;
        }
    }

    // byte 4
    static byteFour(num) {
        const arrIn = data_prm[4].I[0].tem[0];
        const arrOut = data_prm[4].I[0].tem[1];
        const term = arrIn.indexOf(num);
        return arrOut[term];
    }

    //byte 5
    static byteFive(num) {
        const arrIn = data_prm[5].I[0].pwr[0];
        const arrOut = data_prm[5].I[0].pwr[1]; 
        const term = arrIn.indexOf(num);
        return arrOut[term];
    }

    //byte 6
    static byteSix(num1, num2) {
        //mod
        const arrIn_Mod = data_prm[6].I[0].mod[0];
        const arrOut_Mod = data_prm[6].I[0].mod[1];
        //fan
        const arrIn_Fan = data_prm[6].I[1].fan[0];
        const arrOut_Fan = data_prm[6].I[1].fan[1];

        const term1 = arrIn_Mod.indexOf(num1);
        const term2 = arrIn_Fan.indexOf(num2);

        return arrOut_Mod[term1] ^ arrOut_Fan[term2];
    }

    //checksum
    static checkSum(arr) {
        let sum = 1;
        let sumNum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum ^= arr[i];
        }
        sum ^= 1;
        sum ^= (sum >> 4);
        sum &= 15;

        sumNum |= (sum << 4);
        return sumNum;
    }

    //invert
    static invert(n) {
        return parseInt(n.toString(2).split('').map(bit => 1 - bit).join(''),2);
    }

    //Get param
    static checkBit(n) {
        if (n !== 0) {
            return 1;
        } else {
            return 0;
        }
    }

    static highBit(numHex) {
        let bit = [];
        let numDec = IRGatewayManager.convert('H2D', numHex);
        let fistNum = numDec & IRGatewayManager.convert('H2D', '80');
        let secondNum = numDec & IRGatewayManager.convert('H2D', '40');
        let thirth = numDec & IRGatewayManager.convert('H2D', '3F');
        bit.push(thirth, IRGatewayManager.checkBit(fistNum), IRGatewayManager.checkBit(secondNum));
        return bit;
    }

    //render checksum function
    static renderChecksum(arr, I_arr) {
        let BA_term = [];
        let A = [];
        let B = [];
        var C = [];
        let A_term;
        let B_term;
        for (let i = 0; i < arr.length; i++) {
            if (i % 3 === 0) {
                BA_term.push(arr[i]);
            }
            else if (i % 3 === 1) {
                A.push(arr[i]);
            }
            else if (i % 3 === 2) {
                B.push(arr[i]);
            }
        }
        let BA = BA_term.map(x => {
            return IRGatewayManager.highBit(IRGatewayManager.convert('D2H',x))[0];
        })

        let B_byte6 = BA_term.map(x => {
            return IRGatewayManager.highBit(IRGatewayManager.convert('D2H',x))[2];
        })

        let A_byte7 = BA_term.map(x => {
            return IRGatewayManager.highBit(IRGatewayManager.convert('D2H',x))[1];
        })

        for (let i = 0; i < BA.length; i++) {
            if (BA[i] === 0) {
                if (B_byte6[i] === 0 && A_byte7[i] === 0) {
                    A_term = C[A[i]]; 
                    C.push(A_term);
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 0) {
                    A_term = A[i];
                    C.push(A_term);
                }
                if (B_byte6[i] === 0 && A_byte7[i] === 1) {
                    A_term = C[A[i]];
                    C.push(A_term);
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 1) {
                    A_term = A[i];
                    C.push(A_term);
                }
            }
            if (BA[i] === 1) {
                if (B_byte6[i] === 0 && A_byte7[i] === 0) {
                    B_term = C[B[i]]; 
                    C.push(B_term);
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 0) {
                    B_term = C[B[i]];
                    C.push(B[i]);
                }
                if (B_byte6[i] === 0 && A_byte7[i] === 1) {
                    B_term = B[i];
                    C.push(B_term);
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 1) {
                    B_term = B[i];
                    C.push(B_term);
                }
            }
            if (BA[i] === 2) {
                if (B_byte6[i] === 0 && A_byte7[i] === 0) {
                    A_term = C[A[i]];
                    B_term = C[B[i]];
                    C.push(IRGatewayManager.logicalFunc(2, A_term, B_term));
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 0) {
                    A_term = I_arr[A[i]];
                    B_term = C[B[i]];
                    C.push(IRGatewayManager.logicalFunc(2, A_term, B_term));
                } 
                if (B_byte6[i] === 0 && A_byte7[i] === 1) {
                    A_term = C[A[i]];
                    B_term = B[i];
                    C.push(IRGatewayManager.logicalFunc(2, A_term, B_term));
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 1) {
                    A_term = I_arr[A[i]];
                    B_term = B[i];
                    C.push(IRGatewayManager.logicalFunc(2, A_term, B_term));
                }
            }
            if (BA[i] === 3) {
                if (B_byte6[i] === 0 && A_byte7[i] === 0) {
                    A_term = C[A[i]];
                    B_term = C[B[i]];
                    C.push(IRGatewayManager.logicalFunc(3, A_term, B_term));
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 0) {
                    A_term = I_arr[A[i]];
                    B_term = C[B[i]];
                    C.push(IRGatewayManager.logicalFunc(3, A_term, B_term));
                } 
                if (B_byte6[i] === 0 && A_byte7[i] === 1) {
                    A_term = C[A[i]];
                    B_term = B[i];
                    C.push(IRGatewayManager.logicalFunc(3, A_term, B_term));
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 1) {
                    A_term = I_arr[A[i]];
                    B_term = B[i];
                    C.push(IRGatewayManager.logicalFunc(3, A_term, B_term));
                }
            }
            if (BA[i] === 4) {
                if (B_byte6[i] === 0 && A_byte7[i] === 0) {
                    A_term = C[A[i]];
                    B_term = C[B[i]];
                    C.push(IRGatewayManager.logicalFunc(4, A_term, B_term));
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 0) {
                    A_term = I_arr[A[i]];
                    B_term = C[B[i]];
                    C.push(IRGatewayManager.logicalFunc(4, A_term, B_term));
                } 
                if (B_byte6[i] === 0 && A_byte7[i] === 1) {
                    A_term = C[A[i]];
                    B_term = B[i];
                    C.push(IRGatewayManager.logicalFunc(4, A_term, B_term));
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 1) {
                    A_term = I_arr[A[i]];
                    B_term = B[i];
                    C.push(IRGatewayManager.logicalFunc(4, A_term, B_term));
                }
            }
            if (BA[i] === 5) {
                if (B_byte6[i] === 0 && A_byte7[i] === 0) {
                    A_term = C[A[i]];
                    B_term = C[B[i]];
                    C.push(IRGatewayManager.logicalFunc(5, A_term, B_term));
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 0) {
                    A_term = I_arr[A[i]];
                    B_term = C[B[i]];
                    C.push(IRGatewayManager.logicalFunc(5, A_term, B_term));
                } 
                if (B_byte6[i] === 0 && A_byte7[i] === 1) {
                    A_term = C[A[i]];
                    B_term = B[i];
                    C.push(IRGatewayManager.logicalFunc(5, A_term, B_term));
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 1) {
                    A_term = I_arr[A[i]];
                    B_term = B[i];
                    C.push(IRGatewayManager.logicalFunc(5, A_term, B_term));
                }
            }
            if (BA[i] === 6) {
                if (B_byte6[i] === 0 && A_byte7[i] === 0) {
                    A_term = C[A[i]];
                    B_term = C[B[i]];
                    C.push(IRGatewayManager.logicalFunc(6, A_term, B_term));
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 0) {
                    A_term = I_arr[A[i]];
                    B_term = C[B[i]];
                    C.push(IRGatewayManager.logicalFunc(6, A_term, B_term));
                } 
                if (B_byte6[i] === 0 && A_byte7[i] === 1) {
                    A_term = C[A[i]];
                    B_term = B[i];
                    C.push(IRGatewayManager.logicalFunc(6, A_term, B_term));
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 1) {
                    A_term = I_arr[A[i]];
                    B_term = B[i];
                    C.push(IRGatewayManager.logicalFunc(6, A_term, B_term));
                }
            }
            if (BA[i] === 7) {
                if (B_byte6[i] === 0 && A_byte7[i] === 0) {
                    A_term = C[A[i]];
                    B_term = C[B[i]];
                    C.push(IRGatewayManager.logicalFunc(7, A_term, B_term));
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 0) {
                    A_term = I_arr[A[i]];
                    B_term = C[B[i]];
                    C.push(IRGatewayManager.logicalFunc(7, A_term, B_term));
                } 
                if (B_byte6[i] === 0 && A_byte7[i] === 1) {
                    A_term = C[A[i]];
                    B_term = B[i];
                    C.push(IRGatewayManager.logicalFunc(7, A_term, B_term));
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 1) {
                    A_term = I_arr[A[i]];
                    B_term = B[i];
                    C.push(IRGatewayManager.logicalFunc(7, A_term, B_term));
                }
            }
            if (BA[i] === 8) {
                if (B_byte6[i] === 0 && A_byte7[i] === 0) {
                    A_term = C[A[i]];
                    B_term = C[B[i]];
                    C.push(IRGatewayManager.logicalFunc(8, A_term, B_term));
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 0) {
                    A_term = I_arr[A[i]];
                    B_term = C[B[i]];
                    C.push(IRGatewayManager.logicalFunc(8, A_term, B_term));
                } 
                if (B_byte6[i] === 0 && A_byte7[i] === 1) {
                    A_term = C[A[i]];
                    B_term = B[i];
                    C.push(IRGatewayManager.logicalFunc(8, A_term, B_term));
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 1) {
                    A_term = I_arr[A[i]];
                    B_term = B[i];
                    C.push(IRGatewayManager.logicalFunc(8, A_term, B_term));
                }
            }
            if (BA[i] === 9) {
                if (B_byte6[i] === 0 && A_byte7[i] === 0) {
                    A_term = C[A[i]];
                    B_term = C[B[i]];
                    C.push(IRGatewayManager.logicalFunc(9, A_term, B_term));
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 0) {
                    A_term = I_arr[A[i]];
                    B_term = C[B[i]];
                    C.push(IRGatewayManager.logicalFunc(9, A_term, B_term));
                } 
                if (B_byte6[i] === 0 && A_byte7[i] === 1) {
                    A_term = C[A[i]];
                    B_term = B[i];
                    C.push(IRGatewayManager.logicalFunc(9, A_term, B_term));
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 1) {
                    A_term = I_arr[A[i]];
                    B_term = B[i];
                    C.push(IRGatewayManager.logicalFunc(9, A_term, B_term));
                }
            }
            if (BA[i] === 10) {
                let term = 1;
                if (B_byte6[i] === 0 && A_byte7[i] === 0) {
                    A_term = C[A[i]];
                    B_term = C[B[i]];
                    for (let i = A_term; i <= B_term; i++) {
                        term ^= I_arr[i];
                    }
                    C.push(term);
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 0) {
                    A_term = I_arr[A[i]];
                    B_term = C[B[i]];
                    for (let i = A_term; i <= B_term; i++) {
                        term ^= I_arr[i];
                    }
                    C.push(term);
                } 
                if (B_byte6[i] === 0 && A_byte7[i] === 1) {
                    A_term = C[A[i]];
                    B_term = B[i];
                    console.log(B_term);
                    for (let i = A_term; i <= B_term; i++) {
                        term ^= I_arr[i];
                    }
                    C.push(term);
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 1) {
                    A_term = I_arr[A[i]];
                    B_term = B[i];
                    for (let i = A_term; i <= B_term; i++) {
                        term ^= I_arr[i];
                    }
                    C.push(term);
                }
            }
            if (BA[i] === 11) {
                if (B_byte6[i] === 0 && A_byte7[i] === 0) {
                    C.push(IRGatewayManager.invert(C[A[i]]));
                    A_term = IRGatewayManager.invert(C[A[i]]); 
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 0) {
                    C.push(IRGatewayManager.invert(A[i]));
                    A_term = IRGatewayManager.invert(A[i]);
                }
                if (B_byte6[i] === 0 && A_byte7[i] === 1) {
                    C.push(IRGatewayManager.invert(C[A[i]]));
                    A_term = IRGatewayManager.invert(C[A[i]]);
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 1) {
                    C.push(IRGatewayManager.invert(A[i]));
                    A_term = IRGatewayManager.invert(A[i]);
                }
            }
            if (BA[i] === 12) {
                if (B_byte6[i] === 0 && A_byte7[i] === 0) {
                    C.push(IRGatewayManager.invert(C[B[i]]));
                    B_term = IRGatewayManager.invert(C[B[i]]); 
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 0) {
                    C.push(IRGatewayManager.invert(B[i]));
                    B_term = IRGatewayManager.invert(B[i]);
                }
                if (B_byte6[i] === 0 && A_byte7[i] === 1) {
                    C.push(IRGatewayManager.invert(C[B[i]]));
                    B_term = IRGatewayManager.invert(C[B[i]]);
                }
                if (B_byte6[i] === 1 && A_byte7[i] === 1) {
                    C.push(IRGatewayManager.invert(B[i]));
                    B_term = IRGatewayManager.invert(B[i]);
                }
            }
        }
        // return [A, B_byte6 , B, A_byte7, BA, C];
        return C;
    }

    //array byte 
    static getArrByte(arr, arrIn) {     //test case [18, 0, 3, 0]
        let byteArr = [];
        
        for (let i = 0; i < arr.length; i++) {
            byteArr.push(arr[i]);
        }
        byteArr.splice(4,0, IRGatewayManager.byteFour(arrIn[0]));
        byteArr.splice(5,0, IRGatewayManager.byteFive(arrIn[1]));
        byteArr.splice(6,0, IRGatewayManager.byteSix(arrIn[2], arrIn[3]));
        // byteArr.splice(6,0, IRGatewayManager)

        // let lastByte = IRGatewayManager.checkSum(byteArr);
        // byteArr.push(lastByte);
        
        return IRGatewayManager.convertArrDecToHex(byteArr);
    }
}

module.exports = IRGatewayManager;





