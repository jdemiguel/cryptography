const constants = require('./constants.js')
const commons = require('./commons.js')

const KEY_LENGTH = 64;
const BLOCK_LENGTH = 64;

class DES {

  /**
   * 
   */
  constructor() {
    this.keyLength = KEY_LENGTH
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
   * @param {*} key 64 bits BigInt
   * @param {*} block 64 bits BigInt
   * @param {*} action ENCRYPT/DECRYPT
   * @returns 
   */
  process(key, block, action) {
    if (key.length * 4 != 64) throw (`Key length must be 64 bits`)
    key = BigInt('0x' + key)
    let keys = this.getKeys(key);
    if (action === constants.ACTION.DECRYPT) keys = keys.reverse();

    const MASK_32 = BigInt('0b' + ''.padEnd(32, '1')) //mascara de n unos para obtener los primeros n bits
    block = applyTable(IP, block, 64)
    let a = (block >> BigInt(32))
    let b = MASK_32 & block
    for (let round = 0; round < 16; round++) {
      const temp = b;
      b = a ^ this.f(keys[round], b)
      a = temp;
    }
    let binaryResult = a + (b << BigInt(32))
    binaryResult = applyTable(IP_INV, binaryResult, 64)
    return binaryResult
  }

  f(key, block) {
    const expandedBlock = applyTable(expansion, block, 32) ^ key
      //8 cajas
    let output = BigInt(0)
    for (let box = 0; box < 8; box++) {
      const inputBox = (expandedBlock >> BigInt(6 * (7 - box))) & BigInt('0b111111')
      const outer = ((inputBox >> BigInt(5)) << BigInt(1)) + (inputBox & BigInt('0b1'))
      const inner = (inputBox >> BigInt(1)) & BigInt('0b1111')
      output += BigInt(S_BOXES[box][outer][inner]) << BigInt((7 - box) * 4)
    }
    return applyTable(P, output, 32)
  }

  getKeys(initialKey) {
    const keys = [];
    let key = applyTable(pc1, initialKey, 64)
    for (let round = 0; round < 16; round++) {
      key = shiftKey(key, round) // desplazamiento a la izda por bloques de 28 1 o 2 posiciones
      const reducedKey = applyTable(pc2, key, 56) //permutacion selectiva 2 que reduce a 48 bits
      keys.push(reducedKey)
    }
    return keys
  }
}

module.exports = {
  DES
}

/**
 * Desplaza los 28
 * 
 * @param {*} key String in binary
 * 
 * 
 */
function shiftKey(key, round) {
  const MASK_N = BigInt('0b' + ''.padEnd(28, '1')) //mascara de n unos para obtener los primeros n bits
  let keyLeft = (key >> BigInt(28))
  let keyRight = MASK_N & key
  keyLeft = commons.circularRotation(keyLeft, bitsRotation[round], 28)
  keyRight = commons.circularRotation(keyRight, bitsRotation[round], 28)
  const output = (keyLeft << BigInt(28)) + keyRight
  return output
}



/**
 * Realiza la permutacion selectiva 2 para la generacion de claves
 * @param {*} input BigInt
 */
function applyTable(table, input, inputLength) {
  const inputString = input.toString(2).padStart(inputLength, '0');
  let output = ''
  table.forEach(element => {
    output += inputString[element - 1]
  });
  return BigInt('0b' + output)
}

const bitsRotation = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1]

const IP = [
  58, 50, 42, 34, 26, 18, 10, 2,
  60, 52, 44, 36, 28, 20, 12, 4,
  62, 54, 46, 38, 30, 22, 14, 6,
  64, 56, 48, 40, 32, 24, 16, 8,
  57, 49, 41, 33, 25, 17, 9, 1,
  59, 51, 43, 35, 27, 19, 11, 3,
  61, 53, 45, 37, 29, 21, 13, 5,
  63, 55, 47, 39, 31, 23, 15, 7
]

const IP_INV = [
  40, 8, 48, 16, 56, 24, 64, 32,
  39, 7, 47, 15, 55, 23, 63, 31,
  38, 6, 46, 14, 54, 22, 62, 30,
  37, 5, 45, 13, 53, 21, 61, 29,
  36, 4, 44, 12, 52, 20, 60, 28,
  35, 3, 43, 11, 51, 19, 59, 27,
  34, 2, 42, 10, 50, 18, 58, 26,
  33, 1, 41, 9, 49, 17, 57, 25
]

const pc2 = [
  14, 17, 11, 24, 1, 5,
  3, 28, 15, 6, 21, 10,
  23, 19, 12, 4, 26, 8,
  16, 7, 27, 20, 13, 2,
  41, 52, 31, 37, 47, 55,
  30, 40, 51, 45, 33, 48,
  44, 49, 39, 56, 34, 53,
  46, 42, 50, 36, 29, 32
]

const pc1 = [
  57, 49, 41, 33, 25, 17, 9,
  1, 58, 50, 42, 34, 26, 18,
  10, 2, 59, 51, 43, 35, 27,
  19, 11, 3, 60, 52, 44, 36,
  63, 55, 47, 39, 31, 23, 15,
  7, 62, 54, 46, 38, 30, 22,
  14, 6, 61, 53, 45, 37, 29,
  21, 13, 5, 28, 20, 12, 4
]

const expansion = [
  32, 1, 2, 3, 4, 5,
  4, 5, 6, 7, 8, 9,
  8, 9, 10, 11, 12, 13,
  12, 13, 14, 15, 16, 17,
  16, 17, 18, 19, 20, 21,
  20, 21, 22, 23, 24, 25,
  24, 25, 26, 27, 28, 29,
  28, 29, 30, 31, 32, 1
]

const P = [
  16, 7, 20, 21, 29, 12, 28, 17,
  1, 15, 23, 26, 5, 18, 31, 10,
  2, 8, 24, 14, 32, 27, 3, 9,
  19, 13, 30, 6, 22, 11, 4, 25,
]

const S_BOXES = [
  [ //S1
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7], //0yyyy0
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8], //0yyyy1
    [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0], //1yyyy0
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13] // 1yyyy1
  ],
  [ //S2
    [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10], //0yyyy0
    [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5], //0yyyy1
    [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15], //1yyyy0
    [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9] // 1yyyy1
  ],
  [ //S3
    [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8], //0yyyy0
    [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1], //0yyyy1
    [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7], //1yyyy0
    [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12] // 1yyyy1
  ],
  [ //S4
    [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15], //0yyyy1
    [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9], //0yyyy1
    [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4], //1yyyy0
    [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14] // 1yyyy1
  ],
  [ //S5
    [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9], //0yyyy0
    [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6], //0yyyy1
    [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14], //1yyyy0
    [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3] // 1yyyy1
  ],
  [ //S6
    [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11], //0yyyy0
    [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8], //0yyyy1
    [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6], //1yyyy0
    [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13] // 1yyyy1
  ],
  [ //S7
    [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1], //0yyyy0
    [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6], //0yyyy1
    [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2], //1yyyy0
    [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12] // 1yyyy1
  ],
  [ //S8
    [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7], //0yyyy0
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2], //0yyyy1
    [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8], //1yyyy0
    [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11] // 1yyyy1

  ]
]