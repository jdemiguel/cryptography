const constants = require('./constants.js')
const commons = require('./commons.js')
const MASK_32 = BigInt('0b' + ''.padEnd(32, '1')) //mascara de n unos para obtener los primeros n bits
const Z_32 = BigInt('0x100000000') //valor de 2^32
const A = BigInt('0x01234567')
const B = BigInt('0x89abcdef')
const C = BigInt('0xfedcba98')
const D = BigInt('0x76543210')

class MD5 {

  /**
   * 
   */
  constructor() {}
    /**
     * 
     * @param {*} msg ASCII string
     * @returns 
     */
  process(msg) {
    console.log('msg:' + msg)
    console.log('msg.length en bytes:' + msg.length)
    let output = ''
    msg = commons.stringToBinary(msg);
    let length = msg.length
    const pad = ((512 - length % 512) - 64 + 512) % 512
    console.log('pad:' + pad)
    msg = msg + '1' //añadimos el uno inicial 
    msg = msg.padEnd(msg.length + pad - 1, '0'); //añadimos ceros hasta que solo queden 64 bits
    msg += (BigInt(length) % BigInt('0xffffffffffffffff')).toString(2).padStart(64, '0') //añadimos en los ultimos 64 bits la longitud del mensaje en modulo 2^64 por si desborda
    console.log('length:' + msg.length)
    let a = A
    let b = B
    let c = C
    let d = D
    msg = BigInt('0b' + msg);
    console.log('msg:' + msg.toString(16))
    this.printStatus(a, b, c, d);
    for (let i = 0; i < 16; i++) {
      let tmp = this.f(b, c, d)
      tmp = this.add(tmp, a)
      tmp = this.add(tmp, (msg >> BigInt((15 - i) * 32)) & MASK_32)
      tmp = this.add(tmp, BigInt(K[i]))
      tmp = commons.circularRotation(tmp, S[i], 32)
      tmp = this.add(tmp, b)
      console.log('M' + (15 -  (15 - i) + ':' + ( (msg >> BigInt((15 - i) * 32)) & MASK_32)))
        //      console.log('M' + ( 15 - 15 + ((1 + i * 5) % 16)))
        //console.log('M' + ( 15 - 15 + ((5 + i * 3) % 16)))
      //console.log('M' + (15 - 15 + ((i * 7) % 16)))
        //console.log('M' + (15 -  ((15 - i * 5) % 16)))
      a = d
      d = c
      c = b
      b = tmp
      console.log('ronda ' + (i + 1))
      this.printStatus(a, b, c, d);

    }
    this.printStatus(a, b, c, d);
    for (let i = 0; i < 16; i++) {
      let tmp = this.g(b, c, d)
      tmp = this.add(tmp, a)
      tmp = this.add(tmp, (msg >> BigInt((((1 + i * 5) % 16) - 15) * 32)) & MASK_32)
      tmp = this.add(tmp, BigInt(K[i + 16]))
      tmp = commons.circularRotation(tmp, S[i + 16], 32)
      tmp = this.add(tmp, b)

      a = d
      d = c
      c = b
      b = tmp
      console.log('ronda ' + (i + 1))
      this.printStatus(a, b, c, d);
    }
    this.printStatus(a, b, c, d);

    for (let i = 0; i < 16; i++) {
      let tmp = this.g(b, c, d)
      tmp = this.add(tmp, a)
      tmp = this.add(tmp, (msg >> BigInt((((5 + i * 3) % 16) - 15) * 32)) & MASK_32)
      tmp = this.add(tmp, BigInt(K[i + 32]))
      tmp = commons.circularRotation(tmp, S[i + 32], 32)
      tmp = this.add(tmp, b)

      a = d
      d = c
      c = b
      b = tmp
      console.log('ronda ' + (i + 1))
    }
    this.printStatus(a, b, c, d);

    for (let i = 0; i < 16; i++) {
      let tmp = this.i(b, c, d)
      tmp = this.add(tmp, a)
      tmp = this.add(tmp, (msg >> BigInt((((i * 7) % 16) - 15) * 32)) & MASK_32)
      tmp = this.add(tmp, BigInt(K[i + 48]))
      tmp = commons.circularRotation(tmp, S[i + 48], 32)
      tmp = this.add(tmp, b)

      a = d
      d = c
      c = b
      b = tmp
      console.log('ronda ' + (i + 1))
    }
    this.printStatus(a, b, c, d);
    a = this.add(A, a)
    b = this.add(B, b)
    c = this.add(C, c)
    d = this.add(D, d)
    this.printStatus(a, b, c, d);

    return output
  }

  printStatus(a, b, c, d) {
    console.log(`${a.toString(16)} ${b.toString(16)} ${c.toString(16)} ${d.toString(16)} `)

  }



  processBlock(block) {



  }
  add(x, y) {
    //console.log(`add. a:${x.toString(16).padStart(8, '0')} b:${y.toString(16).padStart(8, '0')}`);
    return (x + y) % Z_32
  }
  f(x, y, z) {
    return (x & y) | (~x & z)
  }
  g(x, y, z) {
    return (x & z) | (y & ~z)
  }
  h(x, y, z) {
    return x ^ y ^ z
  }
  i(x, y, z) {
    return y ^ (x | ~z)
  }
}


module.exports = {
  MD5
}


K = [
  0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
  0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
  0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
  0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
  0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
  0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
  0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
  0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
  0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
  0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
  0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
  0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
  0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
  0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
  0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
  0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
]

S = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
]