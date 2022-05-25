const constants = require('./constants.js')
const commons = require('./commons.js')


class MD5 {

  /**
   * 
   */
  constructor() {
  }
  /**
   * 
   * @param {*} msg ASCII string
   * @returns 
   */
  process(msg) {
    console.log('msg.length:' + msg.length)
    let output = ''
    msg = commons.stringToHex(msg);
    let length = msg.length // en hex
    const pad = ((128 - length % 128) - 16 + 128) % 128
    msg = msg + '8' //añadimos el uno inicial y tres ceros
    msg = msg.padEnd(msg.length + pad - 1, '0');
    console.log('length:' + msg.length)
    console.log('msg:' + msg)
    return output
  }
}


module.exports = {
  MD5
}
