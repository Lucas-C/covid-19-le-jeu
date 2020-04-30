/*eslint-disable */
import { nextTurnStep } from './game-sequence.js';
import { TurnStep } from './turn-step.js';

export class TurnStep2 extends TurnStep {
  constructor(board) {
    super();
    board.goOnButton.textContent = 'A supprimer';
    board.goOnCallback = () => nextTurnStep(board);
  }
  getStepName() {
    return 'A supprimer';
  }
}
