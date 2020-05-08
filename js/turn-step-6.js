import { TurnStep } from './turn-step.js';
import { nextTurnStep } from './game-sequence.js';
import { messageDesc } from './game-props.js';
import { wrapAnimDelay } from './promise-utils.js';

export class TurnStep6 extends TurnStep {
  constructor(board) {
    super();
    board.goOnButton.textContent = 'Tirer une carte événement';
    board.buttonEnable();
    board.goOnCallback = () => eventCards(board).then(() => nextTurnStep(board));
  }
  getStepName() {
    return 'Gestion des évènements';
  }
}
function eventCards(board) {
  return wrapAnimDelay(() => messageDesc(board, '[Étape 6] Quel événement avez-vous tiré ?'));
}
