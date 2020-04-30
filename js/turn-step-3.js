import { TurnStep } from './turn-step.js';
import { chainExec } from './promise-utils.js';
import { nextTurnStep } from './game-sequence.js';

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
  const pawnsA = board.robotAcademy.extractAllPawns();
  const pawnsB = board.batterieMarketZ1.extractAllPawns();
  console.debug(pawnsA);
  return chainExec(pawnsA.map((pawn) =>
    () => (board.planetTokenAcquirePawn(pawn)),
  )).then(chainExec(pawnsB.map((pawn) =>
    () => (board.planetTokenAcquirePawn(pawn)),
  )));
}
