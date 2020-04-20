// On importe la lib de manière à ce que ça fonctionne en navigateur ET en tests unitaires :
const Seedrandom = Math.seedrandom || require('seedrandom');

export class RandomGenerator { // un instance de cette classe est stockée et accessible dans board.rng
  constructor(seed) {
    this.prng = new Seedrandom(seed);
  }
  pickOne(array) { // Sélectionne un élément au hasard dans un tableau
    return array[Math.floor(array.length * this.prng.quick())];
  }
  randBetween0And1() {
    return this.prng.quick();
  }
  rollDie() {
    return 1 + Math.floor(6 * this.prng.quick());
  }
}

const SEED_WORDS = [ 'robot', 'covid' ]; // liste à compléter avec des mots en rapport avec le jeu

export function randomSeedWord() {
  return SEED_WORDS[1]; // Temporaire : pour l'instant on est déterministe
  // eslint-disable-next-line
  return (new RandomGenerator()).pickOne(SEED_WORDS);
}
