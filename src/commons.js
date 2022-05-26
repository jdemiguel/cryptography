module.exports = {

  /**
   * Devuelve los primos menor igual a n usando la criba de eratóstenes
   * El uno no se devuelve
   * @param {} n 
   */
  getPrimes: function(n) {
    const numbers = []
    const primes = []
    for (let i = 0; i <= n; i++) numbers.push(true)
    for (let i = 2; i <= n; i++) {
      if (numbers[i]) primes.push(i);

      for (let j = i; j <= n; j += i) {
        numbers[j] = false
      }

    }
    return primes
  },
  /**
   * Devuelve un array de n elementos con true o false en funcion de si el elemento es primo o no
   * Utiliza la criba de Erastotenes
   * @param {} n 
   */
  getPrimesArray: function(n) {
    const numbers = []
    for (let i = 0; i <= n; i++) numbers.push(true)
    for (let i = 2; i <= n; i++) {
      for (let j = 2 * i; j <= n; j += i) {
        numbers[j] = false
      }

    }
    return numbers
  },
  /**
   * Comprueba mediante el Test de Miller-Rabin la primalidad del numero n, durante k vueltas
   * @param {*} n bigint
   * @param {*} k number
   */
  millerRabin: function(n, k) {
    if (n < BigInt(6)) return [false, false, true, true, false, true][n]; // valores pequeños provocan comportamiento raro
    if (n % BigInt(2) == 0) return false; //si es par no es primo
    //calculamos d y s tal que n = 2^s * d + 1 (siendo d impar)

    let s = BigInt(0)
    let d = n - BigInt(1)
    while (d % BigInt(2) == 0) {
      s += BigInt(1);
      d = d >> BigInt(1) //dividir entre dos de forma binaria
    }


    for (let i = 0; i < k; i++) {
      const a = BigInt(Math.floor(Math.random() * (Number(n) - 2)) + 2) //numero aleatorio entero entre 2 y n-1
      let fpp = false;
      if (this.power(a, d, n) == 1) {
        fpp = true
      } else {
        for (let r = BigInt(0); r <= s && !fpp; r++) {
          if (n - BigInt(1) == this.power(a, this.power(BigInt(2), r, n) * d, n)) fpp = true;
        }
        if (!fpp) return false;
      }
    }
    return true;
  },
  /**
   * Exponenciacion modular eficiente.
   * Calcula x elevado a y en módulo p
   * @param {*} x 
   * @param {*} y 
   * @param {*} p 
   * @returns 
   */
  power: function(x, y, p) {
    // Initialize result
    let res = BigInt(1);

    // Update x if it is more
    // than or equal to p
    x = x % p;

    if (x == BigInt(0)) return BigInt(0);
    while (y > BigInt(0)) {
      // If y is odd, multiply
      // x with result
      if (y % BigInt(2) == 1) res = (res * x) % p;
      // y must be even now
      // y = $y/2
      y = y >> BigInt(1);
      x = (x * x) % p;
    }
    return res;
  },
  /**
   * Devuelve un número impar aleatorio de n bits con el más significativo a 1
   * @param {} n 
   */
  generateRandom: function(n) {
    let binary = '0b1'
    for (let index = 0; index < n - 2; index++) {
      binary += Math.round(Math.random())
    }
    binary += '1' //lo hacemos impar
    return BigInt(binary)
  },
  /**
   * Devuelve un primo aleatorio de n bits con el más significativo a 1, en la práctica será un número entre 2^n-1 y 2^n
   * @param {*} n 
   */
  generatePrimeRandom: function(n) {
    let limitBinary = '0b'
    for (let index = 0; index < n; index++) limitBinary += '1'
    const limit = BigInt(limitBinary)
    let tentative = this.generateRandom(n);
    const primes = this.getPrimesArray(1000);
    while (tentative < limit) {
      //if (primes[BigInt.asIntN(32, tentative)]) return tentative;
      if (this.millerRabin(tentative, 20)) return tentative;
      tentative += BigInt(2);
    }
    return this.generatePrimeRandom(n) // si desde el random hasta el final no hay ninguno (porque empieza tarde) se vuelve a lanzar a ver si hay mas suerte
  },

  circularRotation: function(key, n, length) {
    const MASK_N = BigInt('0b' + ''.padEnd(length, '1')) //mascara de unos para obtener los primeros bits
    return ((key << BigInt(n)) & MASK_N) + (key >> BigInt(length - n)) //desplazamos a la izda y enmascaramos lo que desborda. Y aparte sumamos lo que ha desbordado desplazado hasta el inicio
  },


  hexToB64: function(hex) {
    if (hex.length % 2) { hex = '0' + hex; }

    var bin = [];
    var i = 0;
    var d;
    var b;
    while (i < hex.length) {
      d = parseInt(hex.slice(i, i + 2), 16);
      b = String.fromCharCode(d);
      bin.push(b);
      i += 2;
    }

    return Buffer.from(bin.join('')).toString('base64');
  },



  hexToAscii: function(str1) {
    var hex = str1.toString(16);
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  },

  /**
   * 
   * @param {*} asciiString ASCII text
   * @returns BigInt
   */
  stringToBinary: function(asciiString) {
    const length = asciiString.length * 8 //8 bits por caracater
    return this.stringToBigInt(asciiString).toString(2).padStart(length, '0');
  },

  /**
   * 
   * @param {*} asciiString ASCII text
   * @returns BigInt
   */
   stringToHex: function(asciiString) {
    const length = asciiString.length * 2 //2 hexadecimal digits por caracter
    return this.stringToBigInt(asciiString).toString(16).padStart(length, '0');
  },  

  /**
   * 
   * @param {*} asciiString ASCII text
   * @returns BigInt
   */
   stringToBigInt: function(asciiString) {
    let bin = '';
    let tempAscii;
    asciiString.split('').map(i => {
      tempAscii = i.charCodeAt(0)
      bin += tempAscii.toString(2).padStart(8, '0');
    });
    return BigInt('0b' + bin);
  }


}