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
  randLetter() {
    const letters = 'AZERTYUIOPQSDFGHJKLMWXCVBN';
    return this.pickOne(letters);
  }
}

const SEED_WORDS = [ 'robot', 'covid', 'bot', 'droid', 'cyborg', 'bionic', 'clone', 'mecha', 'drone' ]; // liste à compléter avec des mots en rapport avec le jeu

export function randomSeedWord() {
  // return SEED_WORDS[1]; // Temporaire : pour l'instant on est déterministe
  // eslint-disable-next-line
  const seed = new RandomGenerator();
  const word = seed.pickOne(SEED_WORDS);
  const letter1 = seed.randLetter();
  const letter2 = seed.randLetter();
  const number = 1 + Math.floor(999 * seed.prng.quick());
  return `${ word }-${ letter1 }${ letter2 }-${ number }`; // 4 051 944 de combinaisons
}
