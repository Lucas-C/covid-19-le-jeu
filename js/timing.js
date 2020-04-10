export const MS = { // Définir toutes ces constantes ici permet de passer en mode "fast" grâce à enableFastAnimations
  ADD_INCUBATING_PAWN_DELAY: 200,
  DICE_ROLL_ANIMATION: 1000,
  PAWN_MOVE_ANIMATION_DURATION: 1000,
};

export function delay({ ms }) {
  return (arg1, arg2, arg3) => new Promise((resolve) => {
    setTimeout(resolve, ms, arg1, arg2, arg3);
  });
}

export function enableFastAnimations() { // très utile pour accélerer les tests manuels
  Object.keys(MS).forEach((delayName) => {
    MS[delayName] = 0;
  });
}
