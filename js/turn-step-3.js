/*eslint-disable */
import { nextTurnStep } from './game-sequence.js';
import { chainExec, wrapAnimDelay } from './promise-utils.js';
import { TurnStep } from './turn-step.js';

export class TurnStep3 extends TurnStep {
  constructor(board) {
    super();
    board.goOnButton.textContent = 'Développer la maladie';
    board.goOnCallback = () => sickedPawns(board).then(() => nextTurnStep(board));
  }
  getStepName() {
    return 'Développement de la maladie';
  }
}

function sickedPawns(board) {
  return wrapAnimDelay(() => board.allPlanets.forEach(planet => { // pour chaque planète
    planet.extractPawnWithState('incubating').forEach(pawn => { // je récupère les pions incubés
      pawn.setState('sick'); // je les passe malade
    });
  })).then(wrapAnimDelay( () => 
    board.allPublicPlaces.forEach(element => { // pour chaque lieu public
      element.extractPawnWithState('incubating').forEach(pawn => { // je récupère les pions incubés
        pawn.setState('sick'); // je les passe malade
      });
    }))).then(wrapAnimDelay( () =>
      board.robotAcademy.extractPawnWithState('incubating').forEach(pawn => { // je récupère les pions incubés
        pawn.setState('sick'); // je les passe malade
      }))).then(wrapAnimDelay( () =>
        board.batterieMarket.extractPawnWithState('incubating').forEach(pawn => { // je récupère les pions incubés
          pawn.setState('sick'); // je les passe malade
        }))).then( () => infectPawns(board));
}

function infectPawns(board) {
  return wrapAnimDelay( () => board.allPlanets.forEach(planet => { // pour chaque planète
    if (planet.isContaminated()) {
      var sanes = planet.extractPawnWithState('sane');
      var toIncubate = Math.min(sanes.length, planet.coefInfection*planet.extractPawnWithState('sick').length - board.bonusInfection);
      for ( var i = 0; i < toIncubate; i++){
          sanes[i].setState('incubating');
      }
    }
  })).then(wrapAnimDelay( () => board.allPublicPlaces.forEach(element => { // pour chaque lieu public
      if (element.isContaminated()) {
        var sanes = element.extractPawnWithState('sane');
        var toIncubate = Math.min(sanes.length, element.coefInfection*element.extractPawnWithState('sick').length - board.bonusInfection);
        for ( var i = 0; i < toIncubate; i++){
            sanes[i].setState('incubating');
        }
      }
     }))).then(wrapAnimDelay( () => {
       if (board.robotAcademy.isContaminated()) {
        var sanes = board.robotAcademy.extractPawnWithState('sane');
        var toIncubate = Math.min(sanes.length, board.robotAcademy.coefInfection*board.robotAcademy.extractPawnWithState('sick').length - board.bonusInfection);
        for ( var i = 0; i < toIncubate; i++){
            sanes[i].setState('incubating');
        }
       }
    }));
  // **TO-DO** pour le batterie market (supermarché) avec la gestion des zones
}
