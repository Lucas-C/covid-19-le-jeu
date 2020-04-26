import { TurnStep } from './turn-step.js';
import { chainExec } from './promise-utils.js';
import { nextTurnStep } from './game-sequence.js';

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
// Retour à la maison ** NE FONCTIONNE PAS **
function returnHome(board) {// ordre : sick, incubating, sane, healed => extractPawns(count,2)
  const pawnsA = board.robotAcademy.extractAllPawns() ;
  const pawnsB = board.batterieMarket.extractAllPawns() ;
  console.log('Retour de '+pawnsA.lenght+' pions de la robot académie');
  return chainExec(pawnsA.map((pawn) => 
    board.planetTokenAcquirePawn(pawn),
  )).then(chainExec(pawnsB.map((pawn) => 
    board.planetTokenAcquirePawn(pawn),
  )));
}