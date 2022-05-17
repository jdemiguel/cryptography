const commons = require('./src/commons.js')
const { LFSR } = require('./src/flow.js');

//console.log('primes:' + JSON.stringify(commons.getPrimesArray(100)))
//console.log('primes:' + JSON.stringify(commons.getPrimes(100)))
//commons.millerRabin(5555555, 5000000)


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