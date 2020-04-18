/*eslint-disable */
import { TurnStep } from './turn-step.js';

export class TurnStep3 extends TurnStep {
  constructor(board) {
    super();
    board.goOnButton.textContent = 'Développer la maladie';
    board.goOnCallback = () => sickedPawns(board);
  }
  getStepName() {
    return 'Développement de la maladie';
  }
}

function sickedPawns(board) {
  board.allPlanets.forEach(planet => { // pour chaque planète
    planet.extractPawnWithState('incubating').forEach(pawn => { // je récupère les pions incubés
      pawn.setState('sick'); // je les passe malade
    });
  });
  board.allPublicPlaces.forEach(element => { // pour chaque lieu public
    element.extractPawnWithState('incubating').forEach(pawn => { // je récupère les pions incubés
      pawn.setState('sick'); // je les passe malade
    });
  });
  board.robotAcademy.extractPawnWithState('incubating').forEach(pawn => { // je récupère les pions incubés
    pawn.setState('sick'); // je les passe malade
  });
  board.batterieMarket.extractPawnWithState('incubating').forEach(pawn => { // je récupère les pions incubés
    pawn.setState('sick'); // je les passe malade
  });

  infectPawns(board);
}

function infectPawns(board) {
  board.allPlanets.forEach(planet => { // pour chaque planète
    if (planet.isContaminated()) {
      var sanes = planet.extractPawnWithState('sane');
      var toIncubate = Maths.min(sanes.length, planet.coefInfection*planet.extractPawnWithState('sick').length - board.bonusInfection);
      for ( var i = 0; i < toIncubate; i++){
          sanes[i].setState('incubating');
      }
    }
  });
  board.allPublicPlaces.forEach(element => { // pour chaque lieu public
    if (element.isContaminated()) {
      var sanes = element.extractPawnWithState('sane');
      var toIncubate = Maths.min(sanes.length, element.coefInfection*element.extractPawnWithState('sick').length - board.bonusInfection);
      for ( var i = 0; i < toIncubate; i++){
          sanes[i].setState('incubating');
      }
    }
  });
  if (board.robotAcademy.isContaminated()) {
    var sanes = board.robotAcademy.extractPawnWithState('sane');
    var toIncubate = Maths.min(sanes.length, board.robotAcademy.coefInfection*board.robotAcademy.extractPawnWithState('sick').length - board.bonusInfection);
    for ( var i = 0; i < toIncubate; i++){
        sanes[i].setState('incubating');
    }
  }
  // **TO-DO** pour le batterie market (supermarché) avec la gestion des zones
}
