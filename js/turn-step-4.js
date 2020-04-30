import { TurnStep } from './turn-step.js';
import { nextTurnStep } from './game-sequence.js';
import { wrapAnimDelay } from './promise-utils.js';

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
  return wrapAnimDelay(
    // TODO
  ).then( () => goRobopital(board));
}
function goRobopital(board) { 
  return wrapAnimDelay(() => board.allPlanets.forEach( (planet) => { // pour chaque planète
    const sicks = planet.getAllPawnsWithState('sick');// je récupère les pions malades
    console.debug('pions malades : ',sicks);
    if (sicks !== null) { // s'il y en a
      sicks.forEach(pawn => { 
        const diceResult = board.rng.rollDie(); // je lance le dé
        console.log('[Étape 5] Résultat du dé:', diceResult);
        if (diceResult === 1) {
          pawn.setState('healed'); // je les passe guéri
        } else if (diceResult > 4) { // je les envoie au robopital
          board.garageColA.acquirePawn(pawn);
        }
      });
    }
  }));
}