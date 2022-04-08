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
    if (n < 6n) return [false, false, true, true, false, true][n]; // valores pequeños provocan comportamiento raro
    if (n % 2n == 0) return false; //si es par no es primo
    //calculamos d y s tal que n = 2^s * d + 1 (siendo d impar)

    let s = 0n
    let d =  n - 1n
    while (d % 2n == 0)  {
      s += 1n;
      d = d >> 1n //dividir entre dos de forma binaria
    }


    for (let i = 0; i < k; i++) {
      const a = BigInt(Math.floor(Math.random() * (Number(n) - 2)) + 2) //numero aleatorio entero entre 2 y n-1
      let fpp = false;
      if (this.power(a, d, n) == 1) {
        fpp = true
      } else {
        for (let r = 0n; r <= s && !fpp; r++) {
          if (n-1n == this.power(a, this.power(2n, r, n) * d, n)) fpp = true;
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
    let res = 1n;

    // Update x if it is more
    // than or equal to p
    x = x % p;

    if (x == 0n) return 0n;
    while (y > 0n) {
      // If y is odd, multiply
      // x with result
      if (y % 2n == 1) res = (res * x) % p;
      // y must be even now
      // y = $y/2
      y = y >> 1n;
      x = (x * x) % p;
    }
    return res;
  },
  /**
   * Devuelve un número impar aleatorio de n bits con el más significativo a 1
   * @param {} n 
   */
  generateRandom: function (n)  {
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
  generatePrimeRandom: function (n)  {
    let limitBinary = '0b'
    for (let index = 0; index < n; index++) limitBinary += '1'
    const limit = BigInt(limitBinary)
    console.log('limit ' + limit)
    let tentative = this.generateRandom(n);
    const primes = this.getPrimesArray (1000);
    while (tentative < limit)  {
      //if (primes[BigInt.asIntN(32, tentative)]) return tentative;
      if (this.millerRabin(tentative, 20)) return tentative;
      tentative += 2n;
    }
    return this.generatePrimeRandom(n) // si desde el random hasta el final no hay ninguno (porque empieza tarde) se vuelve a lanzar a ver si hay mas suerte
  }
}