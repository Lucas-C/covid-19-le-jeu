import { TurnStep } from './turn-step.js';
import { chainExec } from './promise-utils.js';
import { nextTurnStep } from './game-sequence.js';
import { messageDesc } from './game-props.js';

export class TurnStep3 extends TurnStep {
  constructor(board) {
    super();
    board.goOnButton.textContent = 'Faire revenir les robots dans leurs maisons';
    board.buttonEnable();
    board.goOnCallback = () => returnHome(board).then(() => nextTurnStep(board));
  }
  getStepName() {
    return '2e déplacement des habitant.e.s';
  }
}
function returnHome(board) { // ordre : sick, incubating, sane, healed => extractPawns(count,2)
  const pawnsB = board.robotAcademy.extractAllPawns();
  const pawnsC = board.batterieMarketZ2.extractAllPawns();
  return chainExec(pawnsB.map((pawn) =>
    () => board.planetTokenAcquirePawn(pawn),
  )).then(chainExec(pawnsC.map((pawn) =>
    () => (board.planetTokenAcquirePawn(pawn)),
  ))).then(manageZ1(board));
}
function manageZ1(board) {
  const pawnsA = board.batterieMarketZ1.extractAllPawns();
  if (board.batterieMarketZ2.closed === false) { // Cas nominal
    messageDesc(board, '[Étape 3] Déplacement batterieMarket Zone1 vers Zone2');
    return chainExec(pawnsA.map((pawn) =>
      () => (board.batterieMarketZ2.acquirePawn(pawn)),
    ));
  }
  // Carte mesure Bonnes pratiques activée
  messageDesc(board, '[Étape 3] Retour du batterieMarket');
  return chainExec(pawnsA.map((pawn) =>
    () => (board.planetTokenAcquirePawn(pawn)),
  ));
}
