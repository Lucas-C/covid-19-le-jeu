/*eslint-disable */
import { TurnStep } from './turn-step.js';

export class TurnStep5 extends TurnStep {
  constructor(board) {
    super();
  }
  getStepName() {
    return 'Complication des maladies';
  }
}
