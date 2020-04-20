import { delay, MS } from './timing.js';

// Temporise les déplacements des pions pour permettre à l'animation de se déclencher
export function wrapAnimDelay(callback) {
  return delay({ ms: MS.ADD_PAWN_DELAY })() // On délaie légèrement l'ajout à chaque planète pour déclencher l'animation CSS
    .then(callback)
    .then(delay({ ms: MS.PAWN_MOVE_ANIMATION_DURATION })); // On attend la fin de l'animation CSS
}

// Exécute les fonctions d'un tableau (array) l'une après l'autre
export function chainExec(funcs) {
  let startChain = null;
  let promise = new Promise((resolve) => {
    startChain = resolve;
  });
  funcs.forEach((func) => {
    promise = promise.then(() => func());
  });
  startChain();
  return promise;
}
