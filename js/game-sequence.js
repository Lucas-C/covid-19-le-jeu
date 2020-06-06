import { messageDesc, endSplash } from './game-props.js';
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


export function nextTurnStep(board) {
  const turnStepIdElem = board.doc.getElementById('turn-step-id');
  let turnStepNumber = Number(turnStepIdElem.textContent);
  if (++turnStepNumber > 6) {
    turnStepNumber = 1;
    nextTurn(board);
  }
  turnStepIdElem.textContent = turnStepNumber;
  const turnStepDirector = new TURN_STEP_DIRECTORS[turnStepNumber](board);
  board.doc.getElementById('turn-step-name').textContent = turnStepDirector.getStepName();
  board.updateCounters();
  board.updatePlanets();
}

function nextTurn(board) {
  const doc = board.doc;
  const turnNumber = doc.getElementById('turn-number');
  if (turnNumber === '11') {
    board.buttonDisable();
    messageDesc(board, 'PARTIE FINIE : Vous avez perdu !');
    endSplash(board, 'Dommage, vous avez perdu ...', 'Vous avez atteint les 10 tours. Vous avez mis trop de temps à juguler l\'épidémie ...<br/>Sentez-vous libre de rejouer ;-)');
    board.endOverlay.toggleDisplay();
    board.initReplay();
    throw new Error('End game not implemented yet!');
  } else {
    // affichage de l'état du plateau
    board.printState();
    // evaluation des critères de victoire ou défaite
    board.evalWinning();
    turnNumber.textContent = Number(turnNumber.textContent) + 1;
    console.debug('Tour suivant >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    messageDesc(board, '******** Nouveau tour ********');
    board.updateCrisisToken();
    // décalage du curseur tour
    const decal = board.getGoodDimension(17);
    const roundToken = doc.getElementsByClassName('round-token');
    const currentTop = parseInt(roundToken[0].style.top, 10);
    roundToken[0].style.top = `${ currentTop + decal }px`;
  }
}
