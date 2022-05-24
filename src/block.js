const commons = require('./commons.js')
const constants = require('./constants.js')
const { AES } = require('./aes.js')
const { DES } = require('./des.js')
const { TRIPLE_DES } = require('./triple-des.js')

module.exports = {

  /**
   * 
   * @param {*} key ASCII string
   * @param {*} messsage ASCII string
   */
  process: function(algorithmName, key, message, action, mode, iv, format) {
    key = commons.stringToHex(key)
    let algorithm
    switch (algorithmName) {
      case constants.ALGORITHMS.AES_128:
        algorithm = new AES(128)
        break;
      case constants.ALGORITHMS.AES_192:
        algorithm = new AES(192)
        break;
      case constants.ALGORITHMS.AES_256:
        algorithm = new AES(256)
        break;
      case constants.ALGORITHMS.DES:
        algorithm = new DES()
        break;
      case constants.ALGORITHMS.TRIPLE_DES:
        algorithm = new TRIPLE_DES()
        break;
      default:
        throw ('Bad algorithm name')
        break;
    }
    const blockLength = (algorithm.getBlockLength() / 8) // in BYTES
    let output = ''
    if (mode !== constants.MODE.ECB && iv.length != blockLength) throw (`IV length must be ${algorithm.getBlockLength()} bits`)
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
          cypheredBlock = encryptedKey ^ block
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
      output += cypheredBlock.toString(16).padStart(blockLength * 2, '0')
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