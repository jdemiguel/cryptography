const commons = require('./commons.js')
const constants = require('./constants.js')

module.exports = {

  /**
   * 
   * @param {*} key 64 bits ASCII string
   * @param {*} messsage ASCII string
   */
  process: function(algorithm, key, message, action, mode, iv, format) {
    const keyLength = (algorithm.KEY_LENGTH / 8)// in BYTES
    const blockLength = (algorithm.BLOCK_LENGTH / 8)// in BYTES
    let output = ''
    if (key.length != keyLength) throw (`Key length must be ${keyLength} bytes in ASCII`)
    key = commons.stringToBigInt(key)
    if (mode !== constants.MODE.ECB && iv.length != blockLength) throw (`IV length must be ${blockLength} bytes in ASCII`)
    let indexBlock = 0
    const rest = message.length % blockLength
    if (rest > 0) {
      for (let i = rest; i < blockLength; i++) message += String.fromCharCode(0)
    }
    if (mode !== constants.MODE.ECB) iv = commons.stringToBigInt(iv)

    let cypheredBlock;
    let block;
    while (indexBlock < message.length) {
      switch (mode) {
        case constants.MODE.CBC:
          block = commons.stringToBigInt(message.substr(indexBlock, blockLength))
          if (action == constants.ACTION.ENCRYPT) block = block ^ iv
          cypheredBlock = algorithm.process(key, block, action)
          if (action == constants.ACTION.ENCRYPT) iv = cypheredBlock
          if (action == constants.ACTION.DECRYPT) {
            cypheredBlock = cypheredBlock ^ iv
            iv = block
          }
          break;
        case constants.MODE.CFB:
          block = commons.stringToBigInt(message.substr(indexBlock, blockLength))
          cypheredBlock = algorithm.process(key, iv, constants.ACTION.ENCRYPT) ^ block
          if (action == constants.ACTION.ENCRYPT) iv = cypheredBlock
          if (action == constants.ACTION.DECRYPT) {
            iv = block
          }
          break;
        case constants.MODE.OFB:
          block = commons.stringToBigInt(message.substr(indexBlock, blockLength))
          const encryptedKey = algorithm.process(key, iv, constants.ACTION.ENCRYPT);
          cypheredBlock =  encryptedKey ^ block
          iv = encryptedKey
          break;
        case constants.MODE.CTR:
          block = commons.stringToBigInt(message.substr(indexBlock, blockLength))
          cypheredBlock = algorithm.process(key, iv, constants.ACTION.ENCRYPT) ^ block
          iv += BigInt(1)
          break;
        default: //ECB
          block = commons.stringToBigInt(message.substr(indexBlock, blockLength))
          cypheredBlock = algorithm.process(key, block, action)
          break;
      }
      output += cypheredBlock.toString(16).padStart(16, '0')
      indexBlock += blockLength
    }
    switch (format) {
      case constants.FORMAT.ASCII:
        return commons.hexToAscii(output)
      case constants.FORMAT.BASE64:
        return commons.hexToB64(output)
      default: //HEX
        return output
    }
  }
}
