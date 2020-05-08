/*eslint-disable */
import { nextTurnStep } from './game-sequence.js';
import { chainExec, wrapAnimDelay } from './promise-utils.js';
import { TurnStep } from './turn-step.js';
import { addPawnOnPlanet } from './init.js';
import { messageDesc } from './game-props.js';

export class TurnStep2 extends TurnStep {
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
  })).then(messageDesc(board, '[Étape 2] Les robots infectés deviennent malades dans les planètes maisons')).then(messageDesc(board, '[Étape 2] Les robots infectés deviennent malades dans les lieux publics')).then(wrapAnimDelay( () => board.allPublicPlaces.forEach(element => { // pour chaque lieu public
      var incubating = element.getAllPawnsWithState('incubating');
      if(incubating !== null){// s'il y en a
        incubating.forEach(pawn => { // je récupère les pions incubés
          pawn.setState('sick'); // je les passe malade
        });
      }
    }))).then(wrapAnimDelay( () => {
      var incubating =  board.robotAcademy.getAllPawnsWithState('incubating'); 
      if(incubating !== null){// s'il y en a
        messageDesc(board, '[Étape 2] Les robots infectés deviennent malades à la robot académie')
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
      incubating =  board.batterieMarketZ2.getAllPawnsWithState('incubating');// je récupère les pions incubés
      if(incubating !== null){// s'il y en a
        incubating.forEach(pawn => { 
          pawn.setState('sick'); // je les passe malade
        });
      }
      messageDesc(board, '[Étape 2] Les robots infectés deviennent malades au supermarché');
    })).then( () => infectPawns(board));
}
// Contagion
function infectPawns(board) {
  console.debug('Début infection');
  return wrapAnimDelay( () => board.allPlanets.forEach(planet => { // pour chaque planète
    if (planet.isContaminated()) {
      console.debug('!!!!!!!!!!!!!!!!!!! Planète contaminée !!!!!!!!!!!!!!!!!!!');
      messageDesc(board, `[Étape 2] La planète ${planet.name} est contaminée`);
      var sanes = planet.getAllPawnsWithState('sane');
      if(sanes===null) sanes = [];
      var toIncubate = Math.min(sanes.length, planet.coefInfection*planet.getAllPawnsWithState('sick').length - board.bonusInfection);
      console.debug('Nb à infecter :',toIncubate);
      messageDesc(board, '[Étape 2] Nombre de robots infectés : ', toIncubate);
      for ( var i = 0; i < toIncubate; i++){
          sanes[i].setState('incubating');
      }
    }
  })).then(wrapAnimDelay( () => board.allPublicPlaces.forEach(element => { // pour chaque lieu public
      if (element.isContaminated()) {
        messageDesc(board, `[Étape 2] Le lieu public ${element.name} est contaminé`);
        var sanes = element.getAllPawnsWithState('sane');
        if(sanes===null) sanes = [];
        var toIncubate = Math.min(sanes.length, element.coefInfection*element.getAllPawnsWithState('sick').length - board.bonusInfection);
        messageDesc(board, '[Étape 2] Nombre de robots infectés : ', toIncubate);
        for ( var i = 0; i < toIncubate; i++){
            sanes[i].setState('incubating');
        }
      }
     }))).then(wrapAnimDelay( () => {
       if (board.robotAcademy.isContaminated()) {
        messageDesc(board, '[Étape 2] La robot académie est contaminée');
        var sanes = board.robotAcademy.getAllPawnsWithState('sane');
        if(sanes===null) sanes = [];
        var toIncubate = Math.min(sanes.length, board.robotAcademy.coefInfection*board.robotAcademy.getAllPawnsWithState('sick').length - board.bonusInfection);
        messageDesc(board, '[Étape 2] Nombre de robots infectés : ', toIncubate);
        for ( var i = 0; i < toIncubate; i++){
            sanes[i].setState('incubating');
        }
       }
    })).then(wrapAnimDelay( () => {// **TO-DO** pour le batterie market (supermarché) avec la gestion des zones
      if (board.batterieMarketZ1.isContaminated()) {
       messageDesc(board, '[Étape 2] La zone 1 du batterieMarket est contaminée');
       var sanes = board.batterieMarketZ1.getAllPawnsWithState('sane');
       if(sanes===null) sanes = [];
       var toIncubate = Math.min(sanes.length, board.batterieMarketZ1.coefInfection*board.batterieMarketZ1.getAllPawnsWithState('sick').length - board.bonusInfection);
       messageDesc(board, '[Étape 2] Nombre de robots infectés : ', toIncubate);
       for ( var i = 0; i < toIncubate; i++){
           sanes[i].setState('incubating');
       }
      }
      if (board.batterieMarketZ2.isContaminated()) {
        messageDesc(board, '[Étape 2] La zone 2 du batterieMarket est contaminée');
        var sanes = board.batterieMarketZ2.getAllPawnsWithState('sane');
        if(sanes===null) sanes = [];
        var toIncubate = Math.min(sanes.length, board.batterieMarketZ2.coefInfection*board.batterieMarketZ2.getAllPawnsWithState('sick').length - board.bonusInfection);
        messageDesc(board, '[Étape 2] Nombre de robots infectés : ', toIncubate);
        for ( var i = 0; i < toIncubate; i++){
            sanes[i].setState('incubating');
        }
       }
   }));
  

}
