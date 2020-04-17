// 1er déplacement des habitant.e.s

import { TurnStep } from './turn-step.js';
import { TypedPlanet } from './game-props.js';

export class TurnStep1 extends TurnStep {
  constructor(board) {
    super();
    const goOnButton = board.doc.getElementById('go-on');
    goOnButton.textContent = 'Effectuer le déplacement';
    board.goOnCallback = () => moveAllPawns(board);
  }
  getStepName() {
    return '1er déplacement des habitant.e.s';
  }
}

/*eslint-disable */
function moveAllPawns(board) {
  TypedPlanet.TYPES.forEach((planetType) => {
    const dieResult = board.rollDie();
    if (dieResult === 1) {
    } else {
    }
  });
}
