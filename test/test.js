const commons = require('../src/commons.js')
const chai = require('chai');
const expect = chai.expect;

describe('Tests Robin-Miller', () => {

  after(() => {})

  before(async function() {});

  it('power', async () => {
    expect(commons.power(2n, 10n, 1000n)).to.be.equals(24n);
    expect(commons.power(2n, 16n, 60000n)).to.be.equals(5536n);
  });

  it('primos de 1 a 100000', async () => {
    const primes = commons.getPrimes(100000);
    primes.forEach (prime => {
      expect(commons.millerRabin(BigInt(prime), 1)).to.be.true;
    })
  });

  it('numeros no primos de 1 a 100000', async () => {
    const primes = commons.getPrimes(100000);
    let index = 4;
    primes.forEach (prime => {
      while (index < prime) {
        expect(commons.millerRabin(BigInt(index), 20)).to.be.false;
        index += 1
      }
      index += 1
    })
  });

  it('generatePrimeRandom', async() => {
    for (let n = 5; n < 100; n++) {
      const primeRandom = commons.generatePrimeRandom(n);
      console.log('valor del primo ' + primeRandom)
      expect(commons.millerRabin(primeRandom, 20)).to.be.true;
    }
  });

});