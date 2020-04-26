/*eslint-disable */
import { TurnStep } from './turn-step.js';

export class TurnStep4 extends TurnStep {
  constructor(board) {
    super();
    board.goOnButton.textContent = 'Faire revenir les robots dans leurs maisons';
    board.goOnCallback = () => returnHome(board).then(() => nextTurnStep(board));
  }
  getStepName() {
    return '2e déplacement des habitant.e.s';
  }
}
// Retour à la maison
function returnHome(board) {//ordre : sick, incubating, sane, healed => extractPawns(count,2)
  var pawnsA = board.robotAcademy.extractAllPawns() ;
  var pawnsB = board.batterieMarket.extractAllPawns() ;
  return chainExec(pawnsA.map(pawn => 
    board.planetTokenAcquirePawn(pawn),
  )).then(chainExec(pawnsA.map(pawn => 
    board.planetTokenAcquirePawn(pawn),
  )));
}