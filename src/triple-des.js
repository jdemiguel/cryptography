const constants = require('./constants.js')
const commons = require('./commons.js')
const {DES} = require('./des.js')
const BLOCK_LENGTH = 64;

class TRIPLE_DES {

  /**
   * 
   */
  constructor() {
    this.keyLength = 192
  }
  
  /**
   * get block length in bits
   * @returns 
   */
  getBlockLength()  {
    return BLOCK_LENGTH
  }
  /**
   * 
   * @param {*} key 192 bits String in HEX
   * @param {*} block 64 bits BigInt
   * @param {*} action ENCRYPT/DECRYPT
   * @returns 
   */
  process(key, block, action) {
    if (key.length * 4 != 192) throw (`Key length must be 192 bits`)
    const des = new DES()
    const key1 = key.substring(0, 16)
    const key2 = key.substring(16, 32)
    const key3 = key.substring(32, 48)
    let it1, it2, it3
    if (action === constants.ACTION.ENCRYPT) {
      it1 = des.process(key1.toString(16).padStart(16, '0'), block, constants.ACTION.ENCRYPT)
      it2 = des.process(key2.toString(16).padStart(16, '0'), it1, constants.ACTION.DECRYPT)
      it3 = des.process(key3.toString(16).padStart(16, '0'), it2, constants.ACTION.ENCRYPT)
    } else {
      it1 = des.process(key3.toString(16).padStart(16, '0'), block, constants.ACTION.DECRYPT)
      it2 = des.process(key2.toString(16).padStart(16, '0'), it1, constants.ACTION.ENCRYPT)
      it3 = des.process(key1.toString(16).padStart(16, '0'), it2, constants.ACTION.DECRYPT)
    }
    return it3
  }
}


module.exports = {
  TRIPLE_DES
}
