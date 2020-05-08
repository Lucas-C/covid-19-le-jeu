import { TurnStep } from './turn-step.js';
import { chainExec } from './promise-utils.js';
import { nextTurnStep } from './game-sequence.js';
import { messageDesc } from './game-props.js';

export class TurnStep3 extends TurnStep {
  constructor(board) {
    super();
    board.goOnButton.textContent = 'Faire revenir les robots dans leurs maisons';
    board.goOnCallback = () => returnHome(board).then(() => nextTurnStep(board));
  }
  getStepName() {
    return '2e déplacement des habitant.e.s';
  }
}
function returnHome(board) { // ordre : sick, incubating, sane, healed => extractPawns(count,2)
  const pawnsA = board.batterieMarketZ1.extractAllPawns();
  const pawnsB = board.robotAcademy.extractAllPawns();
  const pawnsC = board.batterieMarketZ2.extractAllPawns();
  return chainExec(pawnsB.map((pawn) =>
    () => (board.planetTokenAcquirePawn(pawn)),
  )).then(messageDesc(board, 'Retour de la robot académie')).then(chainExec(pawnsC.map((pawn) =>
    () => (board.planetTokenAcquirePawn(pawn)),
  ))).then(messageDesc(board, 'Retour du batterieMarket')).then(chainExec(pawnsA.map((pawn) =>
    () => (board.batterieMarketZ2.acquirePawn(pawn)),
  ))).then(messageDesc(board, 'Déplacement batterieMarket Zone1 vers Zone2'));
}
