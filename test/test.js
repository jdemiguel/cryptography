const commons = require('../src/commons.js')
const DES = require('../src/des.js')
const TRIPLE_DES = require('../src/triple-des.js')
const block = require('../src/block.js')
const { LFSR } = require('../src/flow.js')
const chai = require('chai');
const constants = require('../src/constants.js');
const expect = chai.expect;

describe('Tests Robin-Miller', () => {

  after(() => {})

  before(async function() {});

  it('power', async() => {
    expect(commons.power(BigInt(2), BigInt(10), BigInt(1000))).to.be.equals(BigInt(24));
    expect(commons.power(BigInt(2), BigInt(16), BigInt(60000))).to.be.equals(BigInt(5536));
  });

  it('primos de 1 a 100000', async() => {
    const primes = commons.getPrimes(100000);
    primes.forEach(prime => {
      expect(commons.millerRabin(BigInt(prime), 1)).to.be.true;
    })
  });

  it('numeros no primos de 1 a 100000', async() => {
    const primes = commons.getPrimes(100000);
    let index = 4;
    primes.forEach(prime => {
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
      expect(commons.millerRabin(primeRandom, 20)).to.be.true;
    }
  });

  it('lfsr x4 + x + 1 con semilla 0001', async() => {
    const lfsr = new LFSR(BigInt('0b1'), 4, [4, 1]);
    const result = [1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1]
    for (let i = 0; i < 15; i++) {
      expect(lfsr.next()).to.be.equals(result[i])
    }
  });

  it('lfsr x4 + x3 + x2 + x  + 1 con semilla 0001', async() => {
    const lfsr = new LFSR(BigInt('0b1'), 4, [4, 3, 2, 1]);
    const result = [1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1]
    for (let i = 0; i < 15; i++) {
      expect(lfsr.next()).to.be.equals(result[i])
    }
  });


  it('lfsr x4 + x3 + x  + 1 con semilla 010', async() => {
    const lfsr = new LFSR(BigInt('0b010'), 4, [4, 3, 1]);
    const result = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0]
    for (let i = 0; i < 15; i++) {
      expect(lfsr.next()).to.be.equals(result[i])
    }
  });


  it('lfsr x4 + x3 + x  + 1 con semilla 0001', async() => {
    const lfsr = new LFSR(BigInt('0b1'), 4, [4, 3, 1]);
    const result = [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0]
    for (let i = 0; i < 15; i++) {
      expect(lfsr.next()).to.be.equals(result[i])
    }
  });


  it('encrypt DES key length not valid', async() => {
    const mode = constants.MODE.ECB;
    let message = ''
    let key = '123456789'
    try {
      const encrypted = block.process(DES, key, message, constants.ACTION.ENCRYPT, mode, '', constants.FORMAT.ASCII);
      expect.fail('debería dar error');
    } catch (err) {
      expect(err).to.be.equals('Key length must be 8 bytes in ASCII')
    };    
  });

  it('encrypt DES IV length not valid', async() => {
    const mode = constants.MODE.CBC;
    let message = ''
    let key = '12345678'
    let iv = '123456789'
    try {
      const encrypted = block.process(DES, key, message, constants.ACTION.ENCRYPT, mode, iv, constants.FORMAT.ASCII);
      expect.fail('debería dar error');
    } catch (err) {
      expect(err).to.be.equals('IV length must be 8 bytes in ASCII')
    };    
  });


  it('encrypt/decrypt DES ECB RANDOM', async() => {
    const mode = constants.MODE.ECB;
    let message = ''
    let key = ''
    for (let n = 0; n < 8; n++) {
      key += String.fromCharCode(Math.floor(Math.random() * 256))
    }
    for (let n = 0; n < 100; n++) {
      message += String.fromCharCode(Math.floor(Math.random() * 256))
      const encrypted = block.process(DES, key, message, constants.ACTION.ENCRYPT, mode, '', constants.FORMAT.ASCII);
      const decrypted = block.process(DES, key, encrypted, constants.ACTION.DECRYPT, mode, '', constants.FORMAT.ASCII)
      expect(decrypted.substring(0, n + 1)).to.be.equals(message)
    }
  });

  it('encrypt/decrypt DES CBC RANDOM', async() => {
    const mode = constants.MODE.CBC;
    let message = ''
    let key = ''
    let iv = ''
    for (let n = 0; n < 8; n++) {
      key += String.fromCharCode(Math.floor(Math.random() * 256))
      iv += String.fromCharCode(Math.floor(Math.random() * 256))
    }
    for (let n = 0; n < 100; n++) {
      message += String.fromCharCode(Math.floor(Math.random() * 256))
      const encrypted = block.process(DES, key, message, constants.ACTION.ENCRYPT, mode, iv, constants.FORMAT.ASCII);
      const decrypted = block.process(DES, key, encrypted, constants.ACTION.DECRYPT, mode, iv, constants.FORMAT.ASCII)
      expect(decrypted.substring(0, n + 1)).to.be.equals(message)
    }
  });

  it('encrypt/decrypt DES CFB RANDOM', async() => {
    const mode = constants.MODE.CFB;
    let message = ''
    let key = ''
    let iv = ''
    for (let n = 0; n < 8; n++) {
      key += String.fromCharCode(Math.floor(Math.random() * 256))
      iv += String.fromCharCode(Math.floor(Math.random() * 256))
    }
    for (let n = 0; n < 100; n++) {
      message += String.fromCharCode(Math.floor(Math.random() * 256))
      const encrypted = block.process(DES, key, message, constants.ACTION.ENCRYPT, mode, iv, constants.FORMAT.ASCII);
      const decrypted = block.process(DES, key, encrypted, constants.ACTION.DECRYPT, mode, iv, constants.FORMAT.ASCII)
      expect(decrypted.substring(0, n + 1)).to.be.equals(message)
    }
  });

  it('encrypt/decrypt DES OFB RANDOM', async() => {
    const mode = constants.MODE.OFB;
    let message = ''
    let key = ''
    let iv = ''
    for (let n = 0; n < 8; n++) {
      key += String.fromCharCode(Math.floor(Math.random() * 256))
      iv += String.fromCharCode(Math.floor(Math.random() * 256))
    }
    for (let n = 0; n < 100; n++) {
      message += String.fromCharCode(Math.floor(Math.random() * 256))
      const encrypted = block.process(DES, key, message, constants.ACTION.ENCRYPT, mode, iv, constants.FORMAT.ASCII);
      const decrypted = block.process(DES, key, encrypted, constants.ACTION.DECRYPT, mode, iv, constants.FORMAT.ASCII)
      expect(decrypted.substring(0, n + 1)).to.be.equals(message)
    }
  });

  it('encrypt/decrypt DES CTR RANDOM', async() => {
    const mode = constants.MODE.CTR;
    let message = ''
    let key = ''
    let iv = ''
    for (let n = 0; n < 8; n++) {
      key += String.fromCharCode(Math.floor(Math.random() * 256))
      iv += String.fromCharCode(Math.floor(Math.random() * 256))
    }
    for (let n = 0; n < 100; n++) {
      message += String.fromCharCode(Math.floor(Math.random() * 256))
      const encrypted = block.process(DES, key, message, constants.ACTION.ENCRYPT, mode, iv, constants.FORMAT.ASCII);
      const decrypted = block.process(DES, key, encrypted, constants.ACTION.DECRYPT, mode, iv, constants.FORMAT.ASCII)
      expect(decrypted.substring(0, n + 1)).to.be.equals(message)
    }
  });

  it('encrypt BLOCK FORMATS', async() => {
    const mode = constants.MODE.OFB;
    let message = '1234567887654321000011112222333344445555s'
    let key = 'sjhjhhhs'
    let iv = '12345678'
    const encryptedDefault = block.process(DES, key, message, constants.ACTION.ENCRYPT, mode, iv, ''); //HEX
    const encryptedAscii = block.process(DES, key, message, constants.ACTION.ENCRYPT, mode, iv, constants.FORMAT.ASCII);
    const encryptedHex = block.process(DES, key, message, constants.ACTION.ENCRYPT, mode, iv, constants.FORMAT.HEX);
    const encryptedBase64 = block.process(DES, key, message, constants.ACTION.ENCRYPT, mode, iv, constants.FORMAT.BASE64);
    expect(commons.stringToBigInt(encryptedAscii)).to.be.equals(BigInt('0x' + encryptedHex))
    expect(commons.stringToBigInt(encryptedAscii)).to.be.equals(BigInt('0x' + encryptedDefault))
    expect(Buffer.from(encryptedAscii).toString('base64')).to.be.equals(encryptedBase64)
  });


  it('encrypt/decrypt DES ECB VALOR CONOCIDO', async() => {
    const mode = constants.MODE.ECB;
    let message = 'ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123'
    let key = 'ABCDDCBA'
    let result = 'b0267f975c993255b31e4b5e9519537392ed45ca6cf14147b0267f975c993255b31e4b5e9519537392ed45ca6cf14147b0267f975c993255b31e4b5e9519537392ed45ca6cf14147b0267f975c993255b31e4b5e9519537392ed45ca6cf14147b0267f975c993255b31e4b5e9519537392ed45ca6cf14147'
    const encrypted = block.process(DES, key, message, constants.ACTION.ENCRYPT, mode, '', constants.FORMAT.HEX);
    expect(encrypted).to.be.equals(result)
  });

  it('encrypt/decrypt DES CBC VALOR CONOCIDO', async() => {
    const mode = constants.MODE.CBC;
    let message = 'ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123'
    let key = 'ABCDDCBA'
    let iv = 'ABCDEFGH'
    let result = '1a2ef9b33cbafda19e53066ad84ea36414f9fcbccd765b7890dffbdce80c8e30e59dd2359934e4ed0eebfb2e53144545b81d63e7f5686ff1631f1f715a490aada94bd711b62fe72f01ee09b3a40b0aecfbb739c3abf4838acb8d52395a32328839ada7965a710813da0a681f57311f08855b4a604de016a4'
    const encrypted = block.process(DES, key, message, constants.ACTION.ENCRYPT, mode, iv, constants.FORMAT.HEX);
    expect(encrypted).to.be.equals(result)
  });

  it('encrypt/decrypt DES CFB VALOR CONOCIDO', async() => {
    const mode = constants.MODE.CFB;
    let message = 'ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123'
    let key = 'ABCDDCBA'
    let iv = 'ABCDEFGH'
    let result = 'f1643cd319df751d7be1feb1e7b476aef5e2ae0bcb331d337177b76bb51fba05ca149555941062c57a4e5206a4813e5bc10fa11a4a2e6d7f4f63fea240cefc65d3335c102fe5547dc2c0b3526f3699d0b1719bd215536b5a163a2e1dd6d91455daf30260eb9410f311ec1adaf27d105c30a46cbca31aaee7'
    const encrypted = block.process(DES, key, message, constants.ACTION.ENCRYPT, mode, iv, constants.FORMAT.HEX);
    expect(encrypted).to.be.equals(result)
  });

  it('encrypt/decrypt DES CTR VALOR CONOCIDO', async() => {
    const mode = constants.MODE.CTR;
    let message = 'ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123'
    let key = 'ABCDDCBA'
    let iv = 'ABCDEFGH'
    let result = 'f1643cd319df751d27452cec9955a8a3f3212152ec9a9101e01d506386cb2fccc6fa1568d8915acbc22ce6b9813fe31f28ef87e310f933703b783c98ee62030eacc5e8178bbc034e0c4008904ded62a62163673ecdee72959ac3655fba83792ca84a6674939774bec8bd6b5410bc5277090f1271ad6e28f0'
    const encrypted = block.process(DES, key, message, constants.ACTION.ENCRYPT, mode, iv, constants.FORMAT.HEX);
    expect(encrypted).to.be.equals(result)
  });

  it('encrypt/decrypt DES OFB VALOR CONOCIDO', async() => {
    const mode = constants.MODE.OFB;
    let message = 'ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123'
    let key = 'ABCDDCBA'
    let iv = 'ABCDEFGH'
    let result = 'f1643cd319df751db27791160d23252a75b797feda38cd8ddd9628aa527bd7e93e382641e83c18fbda31dd0b574882a6da93193e4a8febfa03770ac0dd0ba74cb7513f76ba28f376cbe82d2fe64bd1c2ebcd094335b0d40d8a63ab4d8823a619a4f6dfc2d4f3fd7156a6d456dc883b1935bc868842054ab8'
    const encrypted = block.process(DES, key, message, constants.ACTION.ENCRYPT, mode, iv, constants.FORMAT.HEX);
    expect(encrypted).to.be.equals(result)
  });


  it('encrypt TRIPLE_DES key length not valid', async() => {
    const mode = constants.MODE.ECB;
    let message = ''
    let key = '12345678'
    try {
      const encrypted = block.process(TRIPLE_DES, key, message, constants.ACTION.ENCRYPT, mode, '', constants.FORMAT.ASCII);
      expect.fail('debería dar error');
    } catch (err) {
      expect(err).to.be.equals('Key length must be 24 bytes in ASCII')
    };    
  });

  it('encrypt TRIPLE_DES IV length not valid', async() => {
    const mode = constants.MODE.CBC;
    let message = ''
    let key = 'ABCDDCBA12345678CDCDCDCD'
    let iv = '123456789'
    try {
      const encrypted = block.process(TRIPLE_DES, key, message, constants.ACTION.ENCRYPT, mode, iv, constants.FORMAT.ASCII);
      expect.fail('debería dar error');
    } catch (err) {
      expect(err).to.be.equals('IV length must be 8 bytes in ASCII')
    };    
  });


  it('encrypt/decrypt TRIPLE_DES ECB VALOR CONOCIDO', async() => {
    const mode = constants.MODE.ECB;
    let message = 'ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123'
    let key = 'ABCDDCBA12345678CDCDCDCD'
    let result = '475c2b6cc8e0774288c469968456992e368ac88e9314f234475c2b6cc8e0774288c469968456992e368ac88e9314f234475c2b6cc8e0774288c469968456992e368ac88e9314f234475c2b6cc8e0774288c469968456992e368ac88e9314f234475c2b6cc8e0774288c469968456992e368ac88e9314f234'
    const encrypted = block.process(TRIPLE_DES, key, message, constants.ACTION.ENCRYPT, mode, '', constants.FORMAT.HEX);
    expect(encrypted).to.be.equals(result)
  });

  it('encrypt/decrypt TRIPLE_DES CBC VALOR CONOCIDO', async() => {
    const mode = constants.MODE.CBC;
    let message = 'ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123'
    let key = 'ABCDDCBA12345678CDCDCDCD'
    let iv = 'ABCDDCBA'
    let result = 'e5c3a8a72ff7d99c8afaba2b80449ef75711cb758273190288e358135c83bc280c4a276e3f6d1218da5c75cc2cdc36ab9afc072f8565844363764da348538b758dbbba12741ee1ce9cc11000ec86dcfd22d23483cb149e10da4fef4095e5ceed5ba4e85fc54e83470c6a8daf9a49efae04dab92e86cd4767'
    const encrypted = block.process(TRIPLE_DES, key, message, constants.ACTION.ENCRYPT, mode, iv, constants.FORMAT.HEX);
    expect(encrypted).to.be.equals(result)
  });

  it('encrypt/decrypt TRIPLE_DES OFB VALOR CONOCIDO', async() => {
    const mode = constants.MODE.OFB;
    let message = 'ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123ABCDEFGHIJK1234567890123'
    let key = 'ABCDDCBA12345678CDCDCDCD'
    let iv = 'ABCDDCBA'
    let result = '310013f30a0b3bd6f32dec9e9b9dfb57240f40ef85e91fbab3c3c810e1c4ac760b711ffd67eb264ff2813311fd6e77ff82ee2a9ce72a06b3b8a4367b97dbe9480860080e68b867c47b4433a2c0fa30e51904f4f650fd0a537def8c77c36dd77e6d11e37876b458bf50a707bdbada100b3ed743ee84e8a38d'
    const encrypted = block.process(TRIPLE_DES, key, message, constants.ACTION.ENCRYPT, mode, iv, constants.FORMAT.HEX);
    expect(encrypted).to.be.equals(result)
  });



  it('encrypt/decrypt TRIPLE_DES ECB RANDOM', async() => {
    const mode = constants.MODE.ECB;
    let message = ''
    let key = ''
    for (let n = 0; n < 24; n++) {
      key += String.fromCharCode(Math.floor(Math.random() * 256))
    }
    for (let n = 0; n < 100; n++) {
      message += String.fromCharCode(Math.floor(Math.random() * 256))
      const encrypted = block.process(TRIPLE_DES, key, message, constants.ACTION.ENCRYPT, mode, '', constants.FORMAT.ASCII);
      const decrypted = block.process(TRIPLE_DES, key, encrypted, constants.ACTION.DECRYPT, mode, '', constants.FORMAT.ASCII)
      expect(decrypted.substring(0, n + 1)).to.be.equals(message)
    }
  });

  it('encrypt/decrypt TRIPLE_DES CBC RANDOM', async() => {
    const mode = constants.MODE.CBC;
    let message = ''
    let key = ''
    let iv = ''
    for (let n = 0; n < 24; n++) {
      key += String.fromCharCode(Math.floor(Math.random() * 256))
    }
    for (let n = 0; n < 8; n++) {
      iv += String.fromCharCode(Math.floor(Math.random() * 256))
    }    
    for (let n = 0; n < 100; n++) {
      message += String.fromCharCode(Math.floor(Math.random() * 256))
      const encrypted = block.process(TRIPLE_DES, key, message, constants.ACTION.ENCRYPT, mode, iv, constants.FORMAT.ASCII);
      const decrypted = block.process(TRIPLE_DES, key, encrypted, constants.ACTION.DECRYPT, mode, iv, constants.FORMAT.ASCII)
      expect(decrypted.substring(0, n + 1)).to.be.equals(message)
    }
  });

  it('encrypt/decrypt TRIPLE_DES CFB RANDOM', async() => {
    const mode = constants.MODE.CFB;
    let message = ''
    let key = ''
    let iv = ''
    for (let n = 0; n < 24; n++) {
      key += String.fromCharCode(Math.floor(Math.random() * 256))
    }
    for (let n = 0; n < 8; n++) {
      iv += String.fromCharCode(Math.floor(Math.random() * 256))
    }    

    for (let n = 0; n < 100; n++) {
      message += String.fromCharCode(Math.floor(Math.random() * 256))
      const encrypted = block.process(TRIPLE_DES, key, message, constants.ACTION.ENCRYPT, mode, iv, constants.FORMAT.ASCII);
      const decrypted = block.process(TRIPLE_DES, key, encrypted, constants.ACTION.DECRYPT, mode, iv, constants.FORMAT.ASCII)
      expect(decrypted.substring(0, n + 1)).to.be.equals(message)
    }
  });

  it('encrypt/decrypt TRIPLE_DES OFB RANDOM', async() => {
    const mode = constants.MODE.OFB;
    let message = ''
    let key = ''
    let iv = ''
    for (let n = 0; n < 24; n++) {
      key += String.fromCharCode(Math.floor(Math.random() * 256))
    }
    for (let n = 0; n < 8; n++) {
      iv += String.fromCharCode(Math.floor(Math.random() * 256))
    }    

    for (let n = 0; n < 100; n++) {
      message += String.fromCharCode(Math.floor(Math.random() * 256))
      const encrypted = block.process(TRIPLE_DES, key, message, constants.ACTION.ENCRYPT, mode, iv, constants.FORMAT.ASCII);
      const decrypted = block.process(TRIPLE_DES, key, encrypted, constants.ACTION.DECRYPT, mode, iv, constants.FORMAT.ASCII)
      expect(decrypted.substring(0, n + 1)).to.be.equals(message)
    }
  });


  it('encrypt/decrypt TRIPLE_DES CTR RANDOM', async() => {
    const mode = constants.MODE.CTR;
    let message = ''
    let key = ''
    let iv = ''
    for (let n = 0; n < 24; n++) {
      key += String.fromCharCode(Math.floor(Math.random() * 256))
    }
    for (let n = 0; n < 8; n++) {
      iv += String.fromCharCode(Math.floor(Math.random() * 256))
    }    

    for (let n = 0; n < 100; n++) {
      message += String.fromCharCode(Math.floor(Math.random() * 256))
      const encrypted = block.process(TRIPLE_DES, key, message, constants.ACTION.ENCRYPT, mode, iv, constants.FORMAT.ASCII);
      const decrypted = block.process(TRIPLE_DES, key, encrypted, constants.ACTION.DECRYPT, mode, iv, constants.FORMAT.ASCII)
      expect(decrypted.substring(0, n + 1)).to.be.equals(message)
    }
  });




});