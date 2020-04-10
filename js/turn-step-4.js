/*eslint-disable */
import { TurnStep } from './turn-step.js';

export class TurnStep4 extends TurnStep {
  constructor(board) {
    super();
  }
  getStepName() {
    return '2e déplacement des habitant.e.s';
  }
}
