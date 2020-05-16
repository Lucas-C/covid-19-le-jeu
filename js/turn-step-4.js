import { TurnStep } from './turn-step.js';
import { nextTurnStep } from './game-sequence.js';
import { wrapAnimDelay } from './promise-utils.js';
import { INITIAL_PAWNS_POS, messageDesc } from './game-props.js';

export class TurnStep4 extends TurnStep {
  constructor(board) {
    super();
    board.goOnButton.textContent = 'Envoyer les malades au robopital ?';
    board.buttonEnable();
    board.goOnCallback = () => manageRobopital(board).then(() => nextTurnStep(board));
  }
  getStepName() {
    return 'Complication des maladies';
  }
}
function manageRobopital(board) {
  return wrapAnimDelay(() => {
    const sicks = board.garageColC.getAllPawnsWithState('sick'); // board.garageColC
    if (sicks !== null) { // s'il y en a
      sicks.forEach((pawn) => {
        const diceResult = board.rng.rollDie(); // je lance le dé
        console.log('[Étape 4] Résultat du dé colC : ', diceResult);
        messageDesc(board, '[Étape 4] Résultat du dé colC : ', diceResult);
        if (diceResult === 6) {
          board.garageColC.extractPawn(pawn);// je retire le pion du jeu
          pawn.setPos(INITIAL_PAWNS_POS);
          messageDesc(board, 'Le robot part au recyclage ...');
        } else if (diceResult < 3) { // le pion est guéri et retourne sur le plateau
          const thePawn = board.garageColC.extractPawn(pawn);
          thePawn.setState('healed');
          messageDesc(board, 'Le robot est guéri, il retourne sur le plateau ^^');
          board.planetTokenAcquirePawn(thePawn);
        }
      });
    }
  },
  ).then(wrapAnimDelay(() => {
    const sicks = board.garageColB.getAllPawnsWithState('sick'); // board.garageColB
    if (sicks !== null) { // s'il y en a
      sicks.forEach((pawn) => {
        const diceResult = board.rng.rollDie(); // je lance le dé
        console.log('[Étape 4] Résultat du dé colB : ', diceResult);
        messageDesc(board, '[Étape 4] Résultat du dé colB : ', diceResult);
        if (diceResult < 2) { // le pion est guéri et retourne sur le plateau
          const thePawn = board.garageColB.extractPawn(pawn);
          thePawn.setState('healed');
          messageDesc(board, 'Le robot est guéri, il retourne sur le plateau ^^');
          board.planetTokenAcquirePawn(thePawn);
        } else { // sinon le pion passe en COlC
          messageDesc(board, '[Étape 4] Les pions de la colonne B vont en colonne C');
          const freeSlots = board.garageColC.getFreeSlots();
          if (freeSlots.length > 0) {
            const thePawn = board.garageColB.extractPawn(pawn);
            board.garageColC.acquirePawn(thePawn);
          }
        }
      });
    }
  })).then(wrapAnimDelay(() => {
    const sicks = board.garageColA.getAllPawnsWithState('sick'); // board.garageColA
    if (sicks !== null) { // s'il y en a
      messageDesc(board, '[Étape 4] Les pions de la colonne A vont en colonne B');
      sicks.forEach((pawn) => {
      // le pion passe en COlB
        const freeSlots = board.garageColB.getFreeSlots();
        if (freeSlots.length > 0) {
          const thePawn = board.garageColA.extractPawn(pawn);
          board.garageColB.acquirePawn(thePawn);
        }
      });
    }
  })).then(() => goRobopital(board));
}
function goRobopital(board) {
  return wrapAnimDelay(() => board.allPlanets.forEach((planet) => { // pour chaque planète maison
    const sicks = planet.getAllPawnsWithState('sick');// je récupère les pions malades
    console.debug('pions malades : ', sicks);
    if (sicks !== null) { // s'il y en a
      sicks.forEach((pawn) => {
        const diceResult = board.rng.rollDie(); // je lance le dé
        console.debug('[Étape 4] Résultat du dé pour chaque malade : ', diceResult);
        messageDesc(board, '[Étape 4] Résultat du dé pour chaque malade : ', diceResult);
        if (diceResult <= board.levelHealing) {
          pawn.setState('healed'); // je les passe guéri
        } else if (diceResult > board.levelRobopital) { // je les envoie au robopital : gérer la carte mesure retour aux urgences
          board.printState();
          const thePawn = planet.extractPawn(pawn);
          if (board.garageColA.getFreeSlots().length > 0) { // s'il y a une place en colonne A
            console.debug('[GoRobopital] Colonne A non pleine : remplissage Colonne A');
            messageDesc(board, 'Colonne A non pleine : les robots vont en Colonne A');
            board.garageColA.acquirePawn(thePawn);
          } else if (board.garageColB.getFreeSlots().length > 0) { // s'il y a une place en colonne B
            console.debug('[GoRobopital] Colonne A pleine : remplissage Colonne B');
            messageDesc(board, 'Colonne A pleine : les robots vont en Colonne B');
            board.garageColB.acquirePawn(thePawn);
          } else if (board.garageColC.getFreeSlots().length > 0) { // s'il y a une place en colonne C
            console.debug('[GoRobopital] Colonnes A et B pleines : remplissage Colonne C');
            messageDesc(board, 'Colonnes A et B pleines : les robots vont en Colonne C');
            board.garageColC.acquirePawn(thePawn);
          } else {
            console.debug('[GoRobopital] Colonnes A, B et C pleines : remplissage Colonne A');
            messageDesc(board, 'Colonnes A, B et C pleines : les robots vont en Colonne A');
            board.garageColA.acquirePawn(thePawn); // sinon je surcharge la colonne A
          }
          board.printState();
        }
      });
    }
  })).then(() => board.allPublicPlaces.forEach((planet) => { // pour chaque lieu public
    const sicks = planet.getAllPawnsWithState('sick');// je récupère les pions malades
    // console.debug('pions malades : ', sicks);
    if (sicks !== null) { // s'il y en a
      sicks.forEach((pawn) => {
        const diceResult = board.rng.rollDie(); // je lance le dé
        console.debug('[Étape 4] Résultat du dé pour chaque malade : ', diceResult);
        messageDesc(board, '[Étape 4] Résultat du dé pour chaque malade : ', diceResult);
        if (diceResult === 1) {
          pawn.setState('healed'); // je les passe guéri
        } else if (diceResult > board.levelRobopital) { // je les envoie au robopital : gérer la carte mesure retour aux urgences
          board.printState();
          const thePawn = planet.extractPawn(pawn);
          if (board.garageColA.getFreeSlots().length > 0) { // s'il y a une place en colonne A
            console.debug('[GoRobopital] Colonne A non pleine : remplissage Colonne A');
            messageDesc(board, 'Colonne A non pleine : les robots vont en Colonne A');
            board.garageColA.acquirePawn(thePawn);
          } else if (board.garageColB.getFreeSlots().length > 0) { // s'il y a une place en colonne B
            console.debug('[GoRobopital] Colonne A pleine : remplissage Colonne B');
            messageDesc(board, 'Colonne A pleine : les robots vont en Colonne B');
            board.garageColB.acquirePawn(thePawn);
          } else if (board.garageColC.getFreeSlots().length > 0) { // s'il y a une place en colonne C
            console.debug('[GoRobopital] Colonnes A et B pleines : remplissage Colonne C');
            messageDesc(board, 'Colonnes A et B pleines : les robots vont en Colonne C');
            board.garageColC.acquirePawn(thePawn);
          } else {
            console.debug('[GoRobopital]Colonnes A, B et C pleines : remplissage Colonne A');
            messageDesc(board, 'Colonnes A, B et C pleines : les robots vont en Colonne A');
            board.garageColA.acquirePawn(thePawn); // sinon je surcharge la colonne A
          }
          board.printState();
        }
      });
    }
  }));
}
