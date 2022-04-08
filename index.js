const commons = require('./src/commons.js')

console.log('primes:' + JSON.stringify(commons.getPrimesArray(100)))
console.log('primes:' + JSON.stringify(commons.getPrimes(100)))
//commons.millerRabin(5555555, 5000000)

console.log(commons.millerRabin(987n, 15))
