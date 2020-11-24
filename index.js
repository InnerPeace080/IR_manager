/*eslint-disable camelcase,no-param-reassign,no-bitwise,complexity*/

const atob = require('atob');
const btoa = require('btoa');

// 1 byte cao:  4 bit for type A , 4 bit for type B
const VAR_TYPE = {
  I: 0,
  C: 1,
  V: 2,
  '': 3,
  IC: 4,
  IV: 5,
  ICV: 6,
  IVC: 7,
  CV: 8,
  CI: 9,
  CVI: 10,
  CIV: 11,
  VC: 12,
  VI: 13,
  VCI: 14,
  VIC: 15
};
const VAR_TYPE_INV = Object.keys(VAR_TYPE).map((c)=>[c, VAR_TYPE[c]])
  .sort((a, b) => {
    return a[1] - b[1];
  })
  .map((c)=>c[0]);

// define Ma lenh: 1 byte
const OPT_TYPE = {
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

const OPT_TYPE_INV = Object.keys(OPT_TYPE).map((c)=>[c, OPT_TYPE[c]])
  .sort((a, b) => {
    return a[1] - b[1];
  })
  .map((c)=>c[0]);

const MODULATION_TYPE={
  LSB: 0,
  LSB8: 1,
  MSB: 2
};

class IRManager {
  convert(op, val=0) {
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
      return this.convert('D2B', x||0);
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
  base64toUInt16Array(base64) {
    var rawString = atob(base64);
    var uint8Array = new Uint8Array(rawString.length);
    for(var i = 0; i < rawString.length; i++)
    {
      uint8Array[i] = rawString.charCodeAt(i);
    }
    var uint16Array = new Uint16Array(uint8Array.buffer);

    return uint16Array;
  }

  BufferArraytoBase64(buf) {
    var data = new Uint8Array(buf);
    var binstr = Array.prototype.map.call(data, (ch) => {
      return String.fromCharCode(ch);
    }).join('');

    return btoa(binstr);
  }

  uInt16ArraytoBase64(buf) {
    var data = new Uint16Array(buf);
    var dataArray=[];
    for (let i = 0; i < data.length; ++i){
      dataArray.push(data[i]&0x00FF);
      dataArray.push(data[i]>>8);
    }
    dataArray= new Uint8Array(dataArray);
    var binstr = Array.prototype.map.call(dataArray, (ch) => {
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
      case VAR_TYPE.I: return I[x]||0;
      case VAR_TYPE.C: return C[x];
      case VAR_TYPE.V: return V[x]||0;
      case VAR_TYPE.xxx: return x;
      case VAR_TYPE.IC: return I[C[x]]||0;
      case VAR_TYPE.IV: return I[V[x]||0]||0;
      case VAR_TYPE.ICV: return I[C[V[x]||0]]||0;
      case VAR_TYPE.IVC: return I[V[C[x]]]||0;
      case VAR_TYPE.CV: return C[V[x]||0];
      case VAR_TYPE.CI: return C[I[x]||0];
      case VAR_TYPE.CVI: return C[V[I[x]||0]||0];
      case VAR_TYPE.CIV: return C[I[V[x]||0]||0];
      case VAR_TYPE.VC: return V[C[x]]||0;
      case VAR_TYPE.VI: return V[I[x]||0]||0;
      case VAR_TYPE.VCI: return V[C[I[x]||0]]||0;
      case VAR_TYPE.VIC: return V[I[C[x]]||0]||0;
      default: return x;
    }
  }
  setABValue(x, type, I, C, V, value){
    switch (type) {
      case VAR_TYPE.I: I[x]=value;break;
      case VAR_TYPE.C: C[x]=value;break;
      case VAR_TYPE.V: V[x]=value;break;
      // case 3: x;
      case VAR_TYPE.IC: I[C[x]]=value;break;
      case VAR_TYPE.IV: I[V[x]]=value;break;
      case VAR_TYPE.ICV: I[C[V[x]]]=value;break;
      case VAR_TYPE.IVC: I[V[C[x]]]=value;break;
      case VAR_TYPE.CV: C[V[x]]=value;break;
      case VAR_TYPE.CI: C[I[x]]=value;break;
      case VAR_TYPE.CVI: C[V[I[x]]]=value;break;
      case VAR_TYPE.CIV: C[I[V[x]]]=value;break;
      case VAR_TYPE.VC: V[C[x]]=value;break;
      case VAR_TYPE.VI: V[I[x]]=value;break;
      case VAR_TYPE.VCI: V[C[I[x]]]=value;break;
      case VAR_TYPE.VIC: V[I[C[x]]]=value;break;
      default:
    }
  }

  //logical
  logicalFunc(num, x, y) {
    switch(num) {
      case OPT_TYPE.ADD:
        return x + y; //ADD
      case OPT_TYPE.SUB:
        return x - y; //SUB
      case OPT_TYPE.AND:
        return x & y; //AND
      case OPT_TYPE.OR:
        return x | y; //OR
      case OPT_TYPE.XOR:
        return x ^ y; //XOR
      case OPT_TYPE.SHIFT_R:
        return x >> y; //right shift
      case OPT_TYPE.SHIFT_L:
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
      if(findENDIF&&OPT_type[i]!==OPT_TYPE.ENDIF){continue;}
      let AVal = this.getABValue(A[i], A_type[i], I, C, V);
      let BVal = this.getABValue(B[i], B_type[i], I, C, V);
      switch (OPT_type[i]) {
        case OPT_TYPE.SETA:
          this.setABValue(B[i], B_type[i], I, C, V, AVal);
          C[i] = AVal;
          break;
        case OPT_TYPE.SETB:
          this.setABValue(A[i], A_type[i], I, C, V, BVal);
          C[i] = BVal;
          break;
        case 2:case 3:case 4:case 5:
        case 6:case 7:case 8:case 9:
          C[i]=this.logicalFunc(OPT_type[i], AVal, BVal);
          break;
        case OPT_TYPE.INVA:
          this.setABValue(B[i], B_type[i], I, C, V, AVal^0xFF);
          C[i]=AVal^0xFF;
          break;
        case OPT_TYPE.INVB:
          this.setABValue(A[i], A_type[i], I, C, V, BVal^0xFF);
          C[i]=BVal^0xFF;
          break;
        case OPT_TYPE.INCA:
          this.setABValue(B[i], B_type[i], I, C, V, AVal+1);
          C[i]=AVal+1;
          break;
        case OPT_TYPE.INCB:
          this.setABValue(A[i], A_type[i], I, C, V, BVal+1);
          C[i]=BVal+1;
          break;
        case OPT_TYPE.IFE:
          if(AVal === BVal){
          }else{
            findENDIF=true;
          }
          break;
        case OPT_TYPE.IFNE:
          if(AVal !== BVal){
          }else{
            findENDIF=true;
          }
          break;
        case OPT_TYPE.IFG:
          if(AVal > BVal){
          }else{
            findENDIF=true;
          }
          break;
        case OPT_TYPE.IFL:
          if(AVal < BVal){
          }else{
            findENDIF=true;
          }
          break;
        case OPT_TYPE.IFGE:
          if(AVal >= BVal){
          }else{
            findENDIF=true;
          }
          break;
        case OPT_TYPE.IFLE:
          if(AVal <= BVal){
          }else{
            findENDIF=true;
          }
          break;
        case OPT_TYPE.ENDIF:
          findENDIF=false;
          break;
        case OPT_TYPE.JUMP:
          i=AVal-1;
          continue;
        default:
          break;
      }
      if(C[i]!==undefined) {ret=C[i];}
    }

    return (ret&0xFF);
  }

  detectOpr(str) {
    if (!isNaN(Number(str))) {
      return {
        number: Number(str),
        type: VAR_TYPE['']
      };
    }
    if (!str.match(/^[ICV]+[0-9]+$/)) {
      return undefined;
    }
    const varType = str.match(/^[ICV]+/)[0];
    const varVal = str.match(/[0-9]+$/)[0];
    if (VAR_TYPE[varType] !== undefined) {
      return {
        number: Number(varVal),
        type: VAR_TYPE[varType]
      };
    } else {
      return undefined;
    }
  }

  encodeOpt(stringOpt){
    var lineCodes = stringOpt.split('\n');
    var result = [];
    var errorLine;
    for (let i = 0; i < lineCodes.length; i++) {
      if(!lineCodes[i].trim()){continue;}
      var optCodes = lineCodes[i].trim().split(/\s+/);
      if (optCodes.length !== 3) {
        errorLine = i ;
        break;
      } else {
        var opt = optCodes[0].trim();
        var oprA = this.detectOpr(optCodes[1].trim());
        var oprB = this.detectOpr(optCodes[2].trim());
        if (OPT_TYPE[opt] !== undefined && oprA !== undefined && oprB !== undefined) {
          result.push((oprA.type<<4)|(oprB.type));
          result.push(OPT_TYPE[opt]);
          result.push(oprA.number);
          result.push(oprB.number);
          continue;
        } else {
          errorLine = i;
          break;
        }
      }
    }

    if (errorLine!==undefined) {
      return {
        errorItem: errorLine
      };
    } else {
      return {
        opts: result,
        errorItem: errorLine
      };
    }
  }

  decodeOpt(arrayOpt){
    let A_type = [];
    let B_type = [];
    let OPT_type = [];
    let A = [];let B = [];
    let ret = '';
    for (let i = 0; i < arrayOpt.length; i++) {
      if (i % 4 === 0) {
        A_type.push((arrayOpt[i]&0xF0)>>4);
        B_type.push(arrayOpt[i]&0x0F);
      }else if (i % 4 === 1) {
        OPT_type.push(arrayOpt[i]);
      }else if (i % 4 === 2) {
        A.push(arrayOpt[i]);
      }else if (i % 4 === 3) {
        B.push(arrayOpt[i]);
      }
    }
    for (let i = 0; i < OPT_type.length; i++) {
      ret += `${`${OPT_TYPE_INV[OPT_type[i]]||'UNKNOW'}`.padEnd( 8, ' ')} ${`${VAR_TYPE_INV[A_type[i]]}${A[i]}`.padEnd( 6, ' ')} ${`${VAR_TYPE_INV[B_type[i]]}${B[i]}`.padEnd(6, ' ')}\n`;
    }

    return ret;
  }

  processByte(info, values){
    var I=[];
    //process Input
    if(info.input&&info.input.length>0){
      info.input.forEach((c, i)=>{
        let name=c.name;
        let value = values[name]||0;
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
    var tb_mapping = modulation.table||[];
    var conv = modulation.conv||[];
    var mod_byte1s = [];
    var mod_byte2s = [];
    var mod_byte3s = [];

    for (let i = 0; i < conv.length; i++) {
      if (i % 3 == 0) {
        mod_byte1s.push(conv[i]);
      }
      if (i % 3 == 1) {
        mod_byte2s.push(conv[i]);
      }
      if (i % 3 == 2) {
        mod_byte3s.push(conv[i]);
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

    return IR_code;
  }

  convertBase64Obj2Array(transport={}){
    transport=transport||{};
    var retTransport={
      byteMap: [],
      modulation: {
        type: 1,
        table: ['', ''],
        conv: ''
      }
    };
    if(transport.byteMap){
      transport.byteMap.forEach((c, i)=>{
        if(typeof(c)==='number'){
          retTransport.byteMap[i]=c;
        }else{
          retTransport.byteMap[i]={};
          if(c.input&&c.input.length>0){
            retTransport.byteMap[i].input = [];
            c.input.forEach((c2, i2)=>{
              retTransport.byteMap[i].input[i2]={};
              retTransport.byteMap[i].input[i2].name=c2.name;
              if(c2.opt) {retTransport.byteMap[i].input[i2].opt= this.base64toBufferArray(c2.opt) ;}
              if(c2.mapping) {
                retTransport.byteMap[i].input[i2].mapping=[this.base64toBufferArray(c2.mapping[0]), this.base64toBufferArray(c2.mapping[1])];
              }
            });
          }
          if(c.opt){
            retTransport.byteMap[i].opt=this.base64toBufferArray(c.opt);
          }
        }
      });
    }
    if(transport.modulation && transport.modulation.table){
      retTransport.modulation.type=transport.modulation.type;
      retTransport.modulation.table=[this.base64toUInt16Array(transport.modulation.table[0]), this.base64toUInt16Array(transport.modulation.table[1])];
      retTransport.modulation.conv=this.base64toBufferArray(transport.modulation.conv) ;
    }

    return retTransport;
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
  VAR_TYPE, VAR_TYPE_INV,
  OPT_TYPE, OPT_TYPE_INV,
  MODULATION_TYPE,
  IRManager: new IRManager()
};
