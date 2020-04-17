
export class RandomGenerator {
  constructor(seed) {
    this.prng = new Math.seedrandom(seed);
  }
  pickOne(array) {
    return array[Math.floor(array.length * this.prng.quick())];
  }
  rollDie() {
    return 1 + Math.floor(6 * this.prng.quick());
  }
}

export function randomSeedWord() {
  // TODO: définir une liste d'une centaine de mots en rapport avec le jeu,
  // et en retourner un au hasard
  return 'robot';
}
