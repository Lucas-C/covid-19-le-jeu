/*eslint-disable */
import { nextTurnStep } from './game-sequence.js';
import { chainExec, wrapAnimDelay } from './promise-utils.js';
import { TurnStep } from './turn-step.js';
import { addPawnOnPlanet } from './init.js';

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
    console.debug('*******************************PLANETE**************************',planet)
    var incubating = planet.getAllPawnsWithState('incubating');// je récupère les pions incubés
    if(incubating !== null){// s'il y en a
      incubating.forEach(pawn => { 
        pawn.setState('sick'); // je les passe malade
      });
    }
  })).then(wrapAnimDelay( () => board.allPublicPlaces.forEach(element => { // pour chaque lieu public
      var incubating = element.getAllPawnsWithState('incubating');
      if(incubating !== null){// s'il y en a
        incubating.forEach(pawn => { // je récupère les pions incubés
          pawn.setState('sick'); // je les passe malade
        });
      }
    }))).then(wrapAnimDelay( () => {
      var incubating =  board.robotAcademy.getAllPawnsWithState('incubating'); 
      if(incubating !== null){// s'il y en a
        incubating.forEach(pawn => { // je récupère les pions incubés
          pawn.setState('sick'); // je les passe malade : erreur
        });
      }
    })).then(wrapAnimDelay( () => {
      var incubating =  board.batterieMarketZ1.getAllPawnsWithState('incubating');// je récupère les pions incubés
      if(incubating !== null){// s'il y en a
        incubating.forEach(pawn => { 
          pawn.setState('sick'); // je les passe malade
        });
      }
    })).then( () => infectPawns(board));
}
// Contagion
function infectPawns(board) {
  console.debug('Début infection');
  return wrapAnimDelay( () => board.allPlanets.forEach(planet => { // pour chaque planète
    if (planet.isContaminated()) {
      console.debug('!!!!!!!!!!!!!!!!!!! Planète contaminée !!!!!!!!!!!!!!!!!!!');
      var sanes = planet.getAllPawnsWithState('sane');
      if(sanes===null) sanes = [];
      var toIncubate = Math.min(sanes.length, planet.coefInfection*planet.getAllPawnsWithState('sick').length - board.bonusInfection);
      console.debug('Nb à infecter :',toIncubate);
      for ( var i = 0; i < toIncubate; i++){
          sanes[i].setState('incubating');
      }
    }
  })).then(wrapAnimDelay( () => board.allPublicPlaces.forEach(element => { // pour chaque lieu public
      if (element.isContaminated()) {
        var sanes = element.getAllPawnsWithState('sane');
        if(sanes===null) sanes = [];
        var toIncubate = Math.min(sanes.length, element.coefInfection*element.getAllPawnsWithState('sick').length - board.bonusInfection);
        for ( var i = 0; i < toIncubate; i++){
            sanes[i].setState('incubating');
        }
      }
     }))).then(wrapAnimDelay( () => {
       if (board.robotAcademy.isContaminated()) {
        var sanes = board.robotAcademy.getAllPawnsWithState('sane');
        if(sanes===null) sanes = [];
        var toIncubate = Math.min(sanes.length, board.robotAcademy.coefInfection*board.robotAcademy.getAllPawnsWithState('sick').length - board.bonusInfection);
        for ( var i = 0; i < toIncubate; i++){
            sanes[i].setState('incubating');
        }
       }
    })).then(wrapAnimDelay( () => {// **TO-DO** pour le batterie market (supermarché) avec la gestion des zones
      if (board.batterieMarketZ1.isContaminated()) {
       var sanes = board.batterieMarketZ1.getAllPawnsWithState('sane');
       if(sanes===null) sanes = [];
       var toIncubate = Math.min(sanes.length, board.batterieMarketZ1.coefInfection*board.batterieMarketZ1.getAllPawnsWithState('sick').length - board.bonusInfection);
       for ( var i = 0; i < toIncubate; i++){
           sanes[i].setState('incubating');
       }
      }
   }));
  

}
