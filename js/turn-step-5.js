import { TurnStep } from './turn-step.js';
import { nextTurnStep } from './game-sequence.js';
import { messageDesc } from './game-props.js';
import { wrapAnimDelay } from './promise-utils.js';

export class TurnStep5 extends TurnStep {
  constructor(board) {
    super();
    board.goOnButton.textContent = 'Choisir les mesures à prendre';
    board.buttonEnable();
    board.goOnCallback = () => mesureCards(board).then(() => nextTurnStep(board));
  }
  getStepName() {
    return 'Prise de mesures de protection';
  }
}
function mesureCards(board) {
  return wrapAnimDelay(() =>
    messageDesc(board, '[Étape 5] Choix des mesures'),
  ).then(board.measuresOverlay.toggleDisplay()).then(board.measuresOverlay.button.innerHTML = 'Masquer les mesures');
}
