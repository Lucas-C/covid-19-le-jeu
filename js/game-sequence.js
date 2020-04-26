const TURN_STEP_DIRECTORS = {};

import { TurnStep1 } from './turn-step-1.js';
TURN_STEP_DIRECTORS[1] = TurnStep1;
import { TurnStep2 } from './turn-step-2.js';
TURN_STEP_DIRECTORS[2] = TurnStep2;
import { TurnStep3 } from './turn-step-3.js';
TURN_STEP_DIRECTORS[3] = TurnStep3;
import { TurnStep4 } from './turn-step-4.js';
TURN_STEP_DIRECTORS[4] = TurnStep4;
import { TurnStep5 } from './turn-step-5.js';
TURN_STEP_DIRECTORS[5] = TurnStep5;
import { TurnStep6 } from './turn-step-6.js';
TURN_STEP_DIRECTORS[6] = TurnStep6;
import { TurnStep7 } from './turn-step-7.js';
TURN_STEP_DIRECTORS[7] = TurnStep7;


export function nextTurnStep(board) {
  const turnStepIdElem = board.doc.getElementById('turn-step-id');
  let turnStepNumber = Number(turnStepIdElem.textContent);
  if (++turnStepNumber > 7) {
    turnStepNumber = 1;
    nextTurn(board.doc);
  }
  turnStepIdElem.textContent = turnStepNumber;
  const turnStepDirector = new TURN_STEP_DIRECTORS[turnStepNumber](board);
  board.doc.getElementById('turn-step-name').textContent = turnStepDirector.getStepName();
  board.updateCounters();
}

function nextTurn(doc) {
  const turnNumber = doc.getElementById('turn-number');
  if (turnNumber === '10') {
    throw new Error('End game not implemented yet!');
  }
  turnNumber.textContent = Number(turnNumber.textContent) + 1;
}
