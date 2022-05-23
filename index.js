const commons = require('./src/commons.js')
const constants = require('./src/constants.js')
const DES = require('./src/des.js')
const AES = require('./src/aes.js')
const TRIPLE_DES = require('./src/triple-des.js')
const block = require('./src/block.js')
const { LFSR } = require('./src/flow.js');

//console.log('primes:' + JSON.stringify(commons.getPrimesArray(100)))
//console.log('primes:' + JSON.stringify(commons.getPrimes(100)))
//commons.millerRabin(5555555, 5000000)

/*
const a = commons.generatePrimeRandom(255)
const b = commons.generatePrimeRandom(255)
const c = a ^ b
console.log(a)
console.log(b)
console.log(c)
console.log(c ^ a)
console.log(c ^ b)


const lfsr = new LFSR(BigInt('0b1'), 4, [4, 1]);
for (let i = 0; i < 16; i++) console.log(lfsr.next());
*/

//const output = des.encrypt('ABCDDCBA', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
let output, output2


//output = block.process(DES, 'ABCDDCBA', 'ABCDEFGHIJK1234567890123', constants.ACTION.ENCRYPT, constants.MODE.ECB, '', constants.FORMAT.HEX);
//console.log(`encrypted DES: ${output}`)


//output = block.process(TRIPLE_DES, 'ABCDDCBAABCDDCBAABCDDCB1', 'ABCDEFGHIJK1234567890123', constants.ACTION.ENCRYPT, constants.MODE.ECB, '', constants.FORMAT.HEX);

//const output2 = block.process(DES, 'ABCDDCBA', output, constants.ACTION.DECRYPT, constants.MODE.CTR, 'PEPEPPEE', constants.FORMAT.ASCII);
console.log(`encrypted 3DES: ${output}`)

AES.setKeyLength(128)
//output = block.process(AES, commons.hexToAscii('8e73b0f7da0e6452c810f32b809079e562f8ead2522c6b7b'), 'manda el mensaje', constants.ACTION.ENCRYPT, constants.MODE.ECB, '', constants.FORMAT.HEX);
output = block.process(AES, commons.hexToAscii('2b7e151628aed2a6abf7158809cf4f3c'), commons.hexToAscii('3243f6a8885a308d313198a2e0370734'), constants.ACTION.ENCRYPT, constants.MODE.ECB, '', constants.FORMAT.HEX);

 

console.log(`encrypted AES: ${output}`)
//console.log(`decrypted: ${output2}`)






//console.log(key.toString(2).padStart(56, 0))
