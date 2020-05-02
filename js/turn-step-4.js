import { TurnStep } from './turn-step.js';
import { nextTurnStep } from './game-sequence.js';
import { wrapAnimDelay } from './promise-utils.js';
import { INITIAL_PAWNS_POS } from './game-props.js';

export class TurnStep4 extends TurnStep {
  constructor(board) {
    super();
    board.goOnButton.textContent = 'Envoyer les malades au robopital ?';
    board.goOnCallback = () => manageRobopital(board).then(() => nextTurnStep(board));
  }
  getStepName() {
    return 'Complication des maladies';
  }
}
function manageRobopital(board) {
  return wrapAnimDelay(() => {
    const sicks = board.garageColC.getAllPawnsWithState('sick'); // board.garageColC
    if (sicks !== null) { // s'il y en a
      sicks.forEach((pawn) => {
        const diceResult = board.rng.rollDie(); // je lance le dé
        console.log('[Etape 4] Résultat du dé colC : ', diceResult);
        if (diceResult === 6) {
          board.garageColC.extractPawn(pawn);// je retire le pion du jeu
          pawn.setPos(INITIAL_PAWNS_POS);
        } else if (diceResult < 3) { // le pion est guéri et retourne sur le plateau
          pawn.setState('healed');
          board.planetTokenAcquirePawn(pawn);
        }
      });
    }
  },
  ).then(wrapAnimDelay(() => {
    const sicks = board.garageColB.getAllPawnsWithState('sick'); // board.garageColB
    if (sicks !== null) { // s'il y en a
      sicks.forEach((pawn) => {
        const diceResult = board.rng.rollDie(); // je lance le dé
        console.log('[Etape 4] Résultat du dé colB : ', diceResult);
        if (diceResult < 2) { // le pion est guéri et retourne sur le plateau
          pawn.setState('healed');
          board.planetTokenAcquirePawn(pawn);
        } else { // sinon le pion passe en COlC
          const freeSlots = board.garageColC.getFreeSlots();
          if (freeSlots.length) {
            board.garageColC.acquirePawn(pawn);
          }
        }
      });
    }
  })).then(wrapAnimDelay(() => {
    const sicks = board.garageColA.getAllPawnsWithState('sick'); // board.garageColA
    if (sicks !== null) { // s'il y en a
      sicks.forEach((pawn) => {
      // le pion passe en COlB
        const freeSlots = board.garageColB.getFreeSlots();
        if (freeSlots.length) {
          board.garageColB.acquirePawn(pawn);
        }
      });
    }
  })).then(() => goRobopital(board));
}
function goRobopital(board) {
  return wrapAnimDelay(() => board.allPlanets.forEach((planet) => { // pour chaque planète
    const sicks = planet.getAllPawnsWithState('sick');// je récupère les pions malades
    console.debug('pions malades : ', sicks);
    if (sicks !== null) { // s'il y en a
      sicks.forEach((pawn) => {
        const diceResult = board.rng.rollDie(); // je lance le dé
        console.debug('[Etape 4] Résultat du dé pour chaque malade : ', diceResult);
        if (diceResult === 1) {
          pawn.setState('healed'); // je les passe guéri
        } else if (diceResult > 4) { // je les envoie au robopital
          board.garageColA.acquirePawn(pawn);
        }
      });
    }
  }));
}
