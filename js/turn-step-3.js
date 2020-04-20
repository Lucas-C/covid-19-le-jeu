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

/*
TODO : extractPawnWithState return null if no pawns in state
*/
function sickedPawns(board) {
  return wrapAnimDelay(() => board.allPlanets.forEach(planet => { // pour chaque planète
    var incubating = planet.extractPawnWithState('incubating');// je récupère les pions incubés
    if(incubating !== null){// s'il y en a
      console.log('[Étape 3] Nombre de pions incubés pour la planète :', incubating.length);
      incubating.forEach(pawn => { 
        pawn.setState('sick'); // je les passe malade
      });
    }
  })).then(wrapAnimDelay( () => board.allPublicPlaces.forEach(element => { // pour chaque lieu public
      var incubating = element.extractPawnWithState('incubating');
      if(incubating !== null){// s'il y en a
        console.log('[Étape 3] Nombre de pions incubés pour le lieu public :', incubating.length);
        incubating.forEach(pawn => { // je récupère les pions incubés
          pawn.setState('sick'); // je les passe malade
        });
      }
    }))).then(wrapAnimDelay( () => {
      var incubating =  board.robotAcademy.extractPawnWithState('incubating'); 
      if(incubating !== null){// s'il y en a
        console.log('[Étape 3] Nombre de pions incubés pour l\'école :', incubating.length)
        incubating.forEach(pawn => { // je récupère les pions incubés
          pawn.setState('sick'); // je les passe malade
        });
      }
    })).then(wrapAnimDelay( () => {
      var incubating =  board.batterieMarket.extractPawnWithState('incubating');// je récupère les pions incubés
      if(incubating !== null){// s'il y en a
        console.log('[Étape 3] Nombre de pions incubés pour le supermarché :', incubating.length);
        incubating.forEach(pawn => { 
          pawn.setState('sick'); // je les passe malade
        });
      }
    })).then( () => infectPawns(board));
}

function infectPawns(board) {
  return wrapAnimDelay( () => board.allPlanets.forEach(planet => { // pour chaque planète
    if (planet.isContaminated()) {
      var sanes = planet.extractPawnWithState('sane');
      if(sanes===null) sanes = [];
      var toIncubate = Math.min(sanes.length, planet.coefInfection*planet.extractPawnWithState('sick').length - board.bonusInfection);
      for ( var i = 0; i < toIncubate; i++){
          sanes[i].setState('incubating');
      }
    }
  })).then(wrapAnimDelay( () => board.allPublicPlaces.forEach(element => { // pour chaque lieu public
      if (element.isContaminated()) {
        var sanes = element.extractPawnWithState('sane');
        if(sanes===null) sanes = [];
        var toIncubate = Math.min(sanes.length, element.coefInfection*element.extractPawnWithState('sick').length - board.bonusInfection);
        for ( var i = 0; i < toIncubate; i++){
            sanes[i].setState('incubating');
        }
      }
     }))).then(wrapAnimDelay( () => {
       if (board.robotAcademy.isContaminated()) {
        var sanes = board.robotAcademy.extractPawnWithState('sane');
        if(sanes===null) sanes = [];
        var toIncubate = Math.min(sanes.length, board.robotAcademy.coefInfection*board.robotAcademy.extractPawnWithState('sick').length - board.bonusInfection);
        for ( var i = 0; i < toIncubate; i++){
            sanes[i].setState('incubating');
        }
       }
    }));
  // **TO-DO** pour le batterie market (supermarché) avec la gestion des zones
}
