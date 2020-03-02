/*eslint-disable camelcase,no-param-reassign,no-bitwise,complexity*/

const atob = require('atob');
const btoa = require('btoa');

// 1 byte cao:  4 bit for type A , 4 bit for type B
const TYPEs = {
  I_x: 0,
  C_x: 1,
  V_x: 2,
  xxx: 3,
  I_C_x: 4,
  I_V_x: 5,
  I_C_V_x: 6,
  I_V_C_x: 7,
  C_V_x: 8,
  C_I_x: 9,
  C_V_I_x: 10,
  C_I_V_x: 11,
  V_C_x: 12,
  V_I_x: 13,
  V_C_I_x: 14,
  V_I_C_x: 15
};

// define Ma lenh: 1 byte
const OPTs = {
  SETA: 0,
  SETB: 1,
  ADD: 2,
  SUB: 3,
  AND: 4,
  OR: 5,
  NOT: 6, // removed
  XOR: 7,
  SHIFT_R: 8,
  SHIFT_L: 9,
  XOR_ARR: 10, // removed
  INVA: 11,
  INVB: 12,
  IFE: 13,
  IFNE: 14,
  IFG: 15,
  IFL: 16,
  IFGE: 17,
  IFLE: 18,
  JUMP: 19,
  ENDIF: 20,
  INCA: 21,
  INCB: 22
};

const MODULATION_TYPE={
  LSB: 0,
  LSB8: 1,
  MSB: 2
};

class IRManager {
  convert(op, val) {
    switch(op) {
      case 'D2H':
        if (val < 0) {
          val = 0xFFFFFFFF + val + 1;
        }

        return val.toString(16).toUpperCase();
      case 'H2D':
        return parseInt(val, 16);
      case 'B2D':
        return parseInt(val, 2);
      case 'D2B':
        var bits = [];
        for (var i = 0; i < 8; i++) {
          bits.push(val % 2);
          val = (val - (val % 2)) / 2;
        }
        bits.reverse();

        return bits.join('');
      case 'H2B':
        return (parseInt(val, 16).toString(2))
          .padStart(8, '0');
      case 'B2H':
        return parseInt(val, 2).toString(16)
          .toUpperCase();
      default:
    }
  }

  converArrHexToDec(arr) {
    let oldArr = arr.map((x) => {
      return this.convert('H2D', x);
    });

    return oldArr;
  }

  convertArrDecToHex(arr) {
    let oldArr = arr.map((x) => {
      return this.convert('D2H', x);
    });

    return oldArr;
  }

  convertArrDecToBinary(arr) {
    let oldArr = arr.map((x) => {
      return this.convert('D2B', x);
    });

    return oldArr;
  }

  //base64 to byte array
  base64toBufferArray(base64) {
    var raw = atob(base64);
    var HEX = [];
    for (let i = 0; i < raw.length; i++ ) {
      var _hex = raw.charCodeAt(i).toString(16);
      HEX.push(_hex.length==2?_hex:'0'+_hex);
    }

    return this.converArrHexToDec(HEX);
  }

  BufferArraytoBase64(buf) {
    var data = new Uint8Array(buf);
    var binstr = Array.prototype.map.call(data, (ch) => {
      return String.fromCharCode(ch);
    }).join('');

    return btoa(binstr);
  }

  //Get param
  checkBit(n) {
    if (n !== 0) {
      return 1;
    } else {
      return 0;
    }
  }

  getABValue(x, type, I, C, V){
    switch (type) {
      case TYPEs.I_x: return I[x];
      case TYPEs.C_x: return C[x];
      case TYPEs.V_x: return V[x];
      case TYPEs.xxx: return x;
      case TYPEs.I_C_x: return I[C[x]];
      case TYPEs.I_V_x: return I[V[x]];
      case TYPEs.I_C_V_x: return I[C[V[x]]];
      case TYPEs.I_V_C_x: return I[V[C[x]]];
      case TYPEs.C_V_x: return C[V[x]];
      case TYPEs.C_I_x: return C[I[x]];
      case TYPEs.C_V_I_x: return C[V[I[x]]];
      case TYPEs.C_I_V_x: return C[I[V[x]]];
      case TYPEs.V_C_x: return V[C[x]];
      case TYPEs.V_I_x: return V[I[x]];
      case TYPEs.V_C_I_x: return V[C[I[x]]];
      case TYPEs.V_I_C_x: return V[I[C[x]]];
      default: return x;
    }
  }
  setABValue(x, type, I, C, V, value){
    switch (type) {
      case TYPEs.I_x: I[x]=value;break;
      case TYPEs.C_x: C[x]=value;break;
      case TYPEs.V_x: V[x]=value;break;
      // case 3: x;
      case TYPEs.I_C_x: I[C[x]]=value;break;
      case TYPEs.I_V_x: I[V[x]]=value;break;
      case TYPEs.I_C_V_x: I[C[V[x]]]=value;break;
      case TYPEs.I_V_C_x: I[V[C[x]]]=value;break;
      case TYPEs.C_V_x: C[V[x]]=value;break;
      case TYPEs.C_I_x: C[I[x]]=value;break;
      case TYPEs.C_V_I_x: C[V[I[x]]]=value;break;
      case TYPEs.C_I_V_x: C[I[V[x]]]=value;break;
      case TYPEs.V_C_x: V[C[x]]=value;break;
      case TYPEs.V_I_x: V[I[x]]=value;break;
      case TYPEs.V_C_I_x: V[C[I[x]]]=value;break;
      case TYPEs.V_I_C_x: V[I[C[x]]]=value;break;
      default:
    }
  }

  //logical
  logicalFunc(num, x, y) {
    switch(num) {
      case OPTs.ADD:
        return x + y; //ADD
      case OPTs.SUB:
        return x - y; //SUB
      case OPTs.AND:
        return x & y; //AND
      case OPTs.OR:
        return x | y; //OR
      case OPTs.XOR:
        return x ^ y; //XOR
      case OPTs.SHIFT_R:
        return x >> y; //right shift
      case OPTs.SHIFT_L:
        return x << y; //left shift
      default:
    }
  }

  processOpt(opt, I){
    let A_type = [];
    let B_type = [];
    let OPT_type = [];
    let A = [];let B = [];
    var V = [];var C = [];
    let ret;
    for (let i = 0; i < opt.length; i++) {
      if (i % 4 === 0) {
        A_type.push((opt[i]&0xF0)>>4);
        B_type.push(opt[i]&0x0F);
      }else if (i % 4 === 1) {
        OPT_type.push(opt[i]);
      }else if (i % 4 === 2) {
        A.push(opt[i]);
      }else if (i % 4 === 3) {
        B.push(opt[i]);
      }
    }
    var findENDIF=false;
    for (let i = 0; i < OPT_type.length; i++) {
      if(findENDIF&&OPT_type[i]!==OPTs.ENDIF){continue;}
      let AVal = this.getABValue(A[i], A_type[i], I, C, V);
      let BVal = this.getABValue(B[i], B_type[i], I, C, V);
      switch (OPT_type[i]) {
        case OPTs.SETA:
          this.setABValue(B[i], B_type[i], I, C, V, AVal);
          C[i] = AVal;
          break;
        case OPTs.SETB:
          this.setABValue(A[i], A_type[i], I, C, V, BVal);
          C[i] = BVal;
          break;
        case 2:case 3:case 4:case 5:
        case 6:case 7:case 8:case 9:
          C[i]=this.logicalFunc(OPT_type[i], AVal, BVal);
          break;
        case OPTs.INVA:
          this.setABValue(B[i], B_type[i], I, C, V, AVal^0xFF);
          C[i]=AVal^0xFF;
          break;
        case OPTs.INVB:
          this.setABValue(A[i], A_type[i], I, C, V, BVal^0xFF);
          C[i]=BVal^0xFF;
          break;
        case OPTs.INCA:
          this.setABValue(B[i], B_type[i], I, C, V, AVal+1);
          C[i]=AVal+1;
          break;
        case OPTs.INCB:
          this.setABValue(A[i], A_type[i], I, C, V, BVal+1);
          C[i]=BVal+1;
          break;
        case OPTs.IFE:
          if(AVal === BVal){
          }else{
            findENDIF=true;
          }
          break;
        case OPTs.IFNE:
          if(AVal !== BVal){
          }else{
            findENDIF=true;
          }
          break;
        case OPTs.IFG:
          if(AVal > BVal){
          }else{
            findENDIF=true;
          }
          break;
        case OPTs.IFL:
          if(AVal < BVal){
          }else{
            findENDIF=true;
          }
          break;
        case OPTs.IFGE:
          if(AVal >= BVal){
          }else{
            findENDIF=true;
          }
          break;
        case OPTs.IFLE:
          if(AVal <= BVal){
          }else{
            findENDIF=true;
          }
          break;
        case OPTs.ENDIF:
          findENDIF=false;
          break;
        case OPTs.JUMP:
          i=AVal-1;
          continue;
        default:
          break;
      }
      if(C[i]!==undefined) {ret=C[i];}
    }

    return ret;
  }

  processByte(info, values){
    var I=[];
    //process Input
    if(info.input){
      info.input.forEach((c, i)=>{
        let name=c.name;
        let value = values[name];
        if(c.mapping){
          let inArr = c.mapping[0];
          let outArr = c.mapping[1];
          const valueIndex = inArr.indexOf(value);
          if(valueIndex>-1) {I[i]=outArr[valueIndex];}
          else{I[i]=value;}
        }
        if(c.opt){
          let temp =this.processOpt(c.opt, [value]);
          if(temp!==undefined){I[i]=temp;}
        }
      });
    }
    if(info.opt){

      return this.processOpt(info.opt, I);
    }else{
      return I[0];
    }
  }

  processData2Send(byteMap=[], values={}){
    let ret = [];
    byteMap.forEach((c, i)=>{
      if(typeof(c) === 'number'){
        ret[i]=c;
      }else{
        if(c&&c.opt&&!c.input){ // this is checksum
          ret[i]=this.processOpt(c.opt, ret.slice(0, i));
        }else{
          ret[i]=this.processByte(c, values);
        }
      }
    });

    return ret;
  }

  //convertIRCode
  convertIRCode(data, modulation) {
    var IR_code = [];
    var IR_code_done = [];
    var tb_mapping = modulation.table;
    var mod = modulation.conv;
    var mod_byte1s = [];
    var mod_byte2s = [];
    var mod_byte3s = [];

    for (let i = 0; i < mod.length; i++) {
      if (i % 3 == 0) {
        mod_byte1s.push(mod[i]);
      }
      if (i % 3 == 1) {
        mod_byte2s.push(mod[i]);
      }
      if (i % 3 == 2) {
        mod_byte3s.push(mod[i]);
      }
    }
    var oldArr = this.convertArrDecToBinary(data);

    mod_byte1s.forEach((type, i)=>{
      let loc = mod_byte2s[i];
      let len = mod_byte3s[i];
      switch (type) {
        case 0: //bit
          for (let j = 0; j < len; j++) {
            IR_code.push(tb_mapping[0][loc]);
            IR_code.push(tb_mapping[1][loc]);
          }
          break;
        case 1: //byte
          let oldArrTemp = oldArr.slice(loc, loc+len);

          switch (modulation.type) {
            case MODULATION_TYPE.LSB:{
              for (let id = oldArrTemp.length-1; id >= 0; id--) {
                for (let id2 = oldArrTemp[id].length-1; id2 >= 0; id2--) {
                  if(oldArrTemp[id].charAt(id2)==='0'){
                    IR_code.push(tb_mapping[0][0]);
                    IR_code.push(tb_mapping[1][0]);
                  }else{
                    IR_code.push(tb_mapping[0][1]);
                    IR_code.push(tb_mapping[1][1]);
                  }
                }
              }
              break;
            }
            case MODULATION_TYPE.LSB8:{
              for (let id = 0; id < oldArrTemp.length; id++) {
                for (let id2 = oldArrTemp[id].length-1; id2 >= 0; id2--) {
                  if(oldArrTemp[id].charAt(id2)==='0'){
                    IR_code.push(tb_mapping[0][0]);
                    IR_code.push(tb_mapping[1][0]);
                  }else{
                    IR_code.push(tb_mapping[0][1]);
                    IR_code.push(tb_mapping[1][1]);
                  }
                }
              }
              break;
            }
            case MODULATION_TYPE.MSB:{
              for (let id = 0; id < oldArrTemp.length; id++) {
                for (let id2 = 0; id2 < oldArrTemp[id].length; id2++) {
                  if(oldArrTemp[id].charAt(id2)==='0'){
                    IR_code.push(tb_mapping[0][0]);
                    IR_code.push(tb_mapping[1][0]);
                  }else{
                    IR_code.push(tb_mapping[0][1]);
                    IR_code.push(tb_mapping[1][1]);
                  }
                }
              }
              break;
            }
            default:
          }
          break;
        default:
      }
    });

    IR_code_done = IR_code.toString().split(',')
      .join('    ');

    return IR_code_done;
  }

  check_IRcode(str, str_check) {
    var wrong = [];

    str = str.replace(/  +/g, ' ').split(/ /g)
      .join(',');
    var arr = str.split(',').map((n) => {
      return Number(n);
    });

    str_check = str_check.replace(/  +/g, ' ').split(/ /g)
      .join(',');
    var arr_check = str_check.split(',').map((n) => {
      return Number(n);
    });

    for (let i = 0; i < str.length; i++) {
      var pro_check = [];
      if (arr[i] != arr_check[i] && arr[i] != ',' && arr_check[i] != ',') {
        pro_check.push(arr[i], arr_check[i], i);
        wrong.push(pro_check);
      }
    }
    if (wrong.length == 0) {
      return 'Done';
    } else {
      return wrong;
    }
  }

}

module.exports = {
  TYPEs,
  OPTs,
  MODULATION_TYPE,
  IRManager: new IRManager()
};
