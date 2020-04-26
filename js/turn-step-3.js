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
// Déclaration des symptômes
function sickedPawns(board) {
  return wrapAnimDelay(() => board.allPlanets.forEach(planet => { // pour chaque planète
    var incubating = planet.extractAllPawnsWithState('incubating');// je récupère les pions incubés
    if(incubating !== null){// s'il y en a
      console.log(incubating);
      incubating.forEach(pawn => { 
        pawn.setState('sick'); // je les passe malade
      });
    }
  })).then(wrapAnimDelay( () => board.allPublicPlaces.forEach(element => { // pour chaque lieu public
      var incubating = element.extractAllPawnsWithState('incubating');
      if(incubating !== null){// s'il y en a
        incubating.forEach(pawn => { // je récupère les pions incubés
          pawn.setState('sick'); // je les passe malade
        });
      }
    }))).then(wrapAnimDelay( () => {
      var incubating =  board.robotAcademy.extractAllPawnsWithState('incubating'); 
      if(incubating !== null){// s'il y en a
        incubating.forEach(pawn => { // je récupère les pions incubés
          pawn.setState('sick'); // je les passe malade
        });
      }
    })).then(wrapAnimDelay( () => {
      var incubating =  board.batterieMarket.extractAllPawnsWithState('incubating');// je récupère les pions incubés
      if(incubating !== null){// s'il y en a
        incubating.forEach(pawn => { 
          pawn.setState('sick'); // je les passe malade
        });
      }
    })).then( () => infectPawns(board));
}
// Contagion
function infectPawns(board) {
  return wrapAnimDelay( () => board.allPlanets.forEach(planet => { // pour chaque planète
    if (planet.isContaminated()) {
      var sanes = planet.extractAllPawnsWithState('sane');
      if(sanes===null) sanes = [];
      var toIncubate = Math.min(sanes.length, planet.coefInfection*planet.extractAllPawnsWithState('sick').length - board.bonusInfection);
      for ( var i = 0; i < toIncubate; i++){
          sanes[i].setState('incubating');
      }
    }
  })).then(wrapAnimDelay( () => board.allPublicPlaces.forEach(element => { // pour chaque lieu public
      if (element.isContaminated()) {
        var sanes = element.extractAllPawnsWithState('sane');
        if(sanes===null) sanes = [];
        var toIncubate = Math.min(sanes.length, element.coefInfection*element.extractAllPawnsWithState('sick').length - board.bonusInfection);
        for ( var i = 0; i < toIncubate; i++){
            sanes[i].setState('incubating');
        }
      }
     }))).then(wrapAnimDelay( () => {
       if (board.robotAcademy.isContaminated()) {
        var sanes = board.robotAcademy.extractAllPawnsWithState('sane');
        if(sanes===null) sanes = [];
        var toIncubate = Math.min(sanes.length, board.robotAcademy.coefInfection*board.robotAcademy.extractAllPawnsWithState('sick').length - board.bonusInfection);
        for ( var i = 0; i < toIncubate; i++){
            sanes[i].setState('incubating');
        }
       }
    })).then(wrapAnimDelay( () => {// **TO-DO** pour le batterie market (supermarché) avec la gestion des zones
      if (board.batterieMarket.isContaminated()) {
       var sanes = board.batterieMarket.extractAllPawnsWithState('sane');
       if(sanes===null) sanes = [];
       var toIncubate = Math.min(sanes.length, board.batterieMarket.coefInfection*board.batterieMarket.extractAllPawnsWithState('sick').length - board.bonusInfection);
       for ( var i = 0; i < toIncubate; i++){
           sanes[i].setState('incubating');
       }
      }
   }));
  

}
