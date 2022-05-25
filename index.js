const commons = require('./src/commons.js')
const constants = require('./src/constants.js')
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

//output = block.process(AES, commons.hexToAscii('8e73b0f7da0e6452c810f32b809079e562f8ead2522c6b7b'), 'manda el mensaje', constants.ACTION.ENCRYPT, constants.MODE.ECB, '', constants.FORMAT.HEX);



//output = block.process(constants.ALGORITHMS.AES_128, commons.hexToAscii('000102030405060708090a0b0c0d0e0f'), commons.hexToAscii('00112233445566778899aabbccddeeff'), constants.ACTION.ENCRYPT, constants.MODE.ECB, '', constants.FORMAT.HEX);
output = block.process(constants.ALGORITHMS.AES_128, commons.hexToAscii('000102030405060708090a0b0c0d0e0f'), commons.hexToAscii('69c4e0d86a7b0430d8cdb78070b4c55a'), constants.ACTION.DECRYPT, constants.MODE.ECB, '', constants.FORMAT.HEX);


//output = block.process(constants.ALGORITHMS.AES_192, '000102030405060708090a0b0c0d0e0f1011121314151617', commons.hexToAscii('00112233445566778899aabbccddeeff'), constants.ACTION.ENCRYPT, constants.MODE.ECB, '', constants.FORMAT.HEX);

//output = block.process(constants.ALGORITHMS.AES_256, '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f', commons.hexToAscii('00112233445566778899aabbccddeeff'), constants.ACTION.ENCRYPT, constants.MODE.ECB, '', constants.FORMAT.HEX);



console.log(`encrypted AES: ${output}`)
//console.log(`decrypted: ${output2}`)






//console.log(key.toString(2).padStart(56, 0))
