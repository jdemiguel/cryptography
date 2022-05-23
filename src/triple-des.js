const constants = require('./constants.js')
const des = require('./des.js')
const KEY_LENGTH = 192;
const BLOCK_LENGTH = 64;
module.exports = {
  /**
   * get key length in bits
   * @returns 
   */
  getKeyLength: function()  {
    return KEY_LENGTH
  },
  /**
   * get block length in bits
   * @returns 
   */
  getBlockLength: function()  {
    return BLOCK_LENGTH
  },  
  /**
   * 
   * @param {*} key 192 bits BigInt
   * @param {*} block 64 bits BigInt
   * @param {*} action ENCRYPT/DECRYPT
   * @returns 
   */
  process: function(key, block, action) {
    const MASK_64 = BigInt('0b' + ''.padEnd(64, '1')) //mascara de n unos para obtener los primeros n bits
    let key1 = key >> BigInt(128)
    let key2 = key >> BigInt(64) & MASK_64
    let key3 = key & MASK_64
    let it1, it2, it3
    if (action === constants.ACTION.ENCRYPT) {
      it1 = des.process(key1, block, constants.ACTION.ENCRYPT)
      it2 = des.process(key2, it1, constants.ACTION.DECRYPT)
      it3 = des.process(key3, it2, constants.ACTION.ENCRYPT)
    } else {
      it1 = des.process(key3, block, constants.ACTION.DECRYPT)
      it2 = des.process(key2, it1, constants.ACTION.ENCRYPT)
      it3 = des.process(key1, it2, constants.ACTION.DECRYPT)
    }
    return it3
  }
}
