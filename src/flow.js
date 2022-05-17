/**
 * Linear Feedback Shift Register
 */

class LFSR {

  /**
   * 
   * @param {*} seed  semilla, valor inicial del registro
   * @param {*} length longitud del registro en bits
   * @param {*} polynomial array con los indices del polinomio. Por ejemplo x⁴ + x + 1 será [4, 1]
   */
  constructor(seed, length, polynomial = [4, 1]) {
    this.seed = BigInt(seed);
    this.length = length
    this.n = 1n;
    this.polynomial = polynomial
    //creamos el registro con los bits de la entrada
    this.registry = [...this.seed.toString(2)].map( item => parseInt(item))
  }

  next() {
    const returnValue = getBit(this.seed, 1n); // se devuelve el ultimo valor y se arealiza todo el flujo
    //const bit = getBit(this.seed, 1n) ^ getBit(this.seed, 4n)
    let bit = getBit(this.seed, BigInt(this.length + 1 - this.polynomial[0]))
    for (let index = 1; index < this.polynomial.length; index++)  {
      bit ^= getBit(this.seed, BigInt(this.length + 1 - this.polynomial[index]))
    }
    const mask = bit << BigInt(this.length - 1)
    this.seed >>= 1n
    this.seed |= mask
    return parseInt(returnValue);
  }
}

module.exports = {
  LFSR
}

/**
 * Devuelve el n-esimo bit de number. Ojo que el primer bit es para n igual a 1
 * @param {*} number 
 * @param {*} n 
 * @returns 
 */
function getBit(number, n)  {
  return ((number & (1n << n-1n)) != 0n) ? 1n : 0n
}
