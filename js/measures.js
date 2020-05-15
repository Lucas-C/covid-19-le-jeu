import { MeasureCard, messageDesc, TypedPlanet } from './game-props.js';
import { chainExec } from './promise-utils.js';

export function initMeasuresCards(board) {
  board.allMeasures.push(new MeasureCard(board, 'fermeture-lieu-public', publicPlaceClosing));
  board.allMeasures.push(new MeasureCard(board, 'limitation-deplacement-antihor', limitMoveLeft));
  board.allMeasures.push(new MeasureCard(board, 'limitation-deplacement-hor', limitMoveRight));
  board.allMeasures.push(new MeasureCard(board, 'confinement', confinement));
  board.allMeasures.push(new MeasureCard(board, 'fermeture-batterie-market', marketClosing));
  board.allMeasures.push(new MeasureCard(board, 'fermeture-transports', transportClosing));
  board.allMeasures.push(new MeasureCard(board, 'limitation-admission-urgences', urgencyClosing));
  board.allMeasures.push(new MeasureCard(board, 'depistages-frontieres', borderScreening));
  board.allMeasures.push(new MeasureCard(board, 'decouverte-traitement', treatmentDiscovery));
  board.allMeasures.push(new MeasureCard(board, 'sensibilisation-ecoles', academyAwareness));
  board.allMeasures.push(new MeasureCard(board, 'bonnes-pratiques-courses', goodPracticesMarket));
  board.allMeasures.push(new MeasureCard(board, 'gestes-barrieres-N1', preventionN1));
  board.allMeasures.push(new MeasureCard(board, 'masque-obligatoire', maskMandatory));
  board.allMeasures.push(new MeasureCard(board, 'gestes-barrieres-N2', preventionN2));
  board.allMeasures.push(new MeasureCard(board, 'fermetures-ecoles', academyClosing));
  board.allMeasures.push(new MeasureCard(board, 'robopital-campagne', robopitalCampagne));
}
function maskMandatory(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE MESURE activée : Port du masque obligatoire');
    board.allPlanets.forEach((planet) => {
      planet.coefInfection = 1;
    });
    board.allPublicPlaces.forEach((planet) => {
      planet.coefInfection = 1;
    });
    board.batterieMarketZ1.coefInfection = 1;
    board.batterieMarketZ2.coefInfection = 1;
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE MESURE désactivée : Port du masque obligatoire');
    board.allPlanets.forEach((planet) => {
      planet.coefInfection = 2;
    });
    board.allPublicPlaces.forEach((planet) => {
      planet.coefInfection = 2;
    });
    board.batterieMarketZ1.coefInfection = 2;
    board.batterieMarketZ2.coefInfection = 2;
  }
}
function preventionN2(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE MESURE activée : Gestes barrières N2');
    board.bonusInfection = 1;
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE MESURE désactivée : Gestes barrières N2');
    board.bonusInfection = 0;
  }
}
function preventionN1(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE MESURE activée : Gestes barrières N1');
    // NOTHING
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE MESURE désactivée : Gestes barrières N1');
    // NOTHING
  }
}
function goodPracticesMarket(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE MESURE activée : Bonnes pratiques dans le BatterieMarket');
    board.batterieMarketZ2.closed = true;
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE MESURE désactivée : Bonnes pratiques dans le BatterieMarket');
    board.batterieMarketZ2.closed = false;
  }
}
function academyAwareness(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE MESURE activée : Sensibilisation aux gestes barrières dans les écoles');
    board.robotAcademy.coefInfection = 2;
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE MESURE désactivée : Sensibilisation aux gestes barrières dans les écoles');
    board.robotAcademy.coefInfection = 4;
  }
}
function treatmentDiscovery(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE MESURE activée : Découverte d\'un traitement');
    board.levelHealing = 3;
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE MESURE désactivée : Découverte d\'un traitement');
    board.levelHealing = 1;
  }
}
function borderScreening(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE MESURE activée : Dépistage systématique aux frontières');
    board.frontieres = true;
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE MESURE désactivée : Dépistage systématique aux frontières');
    board.frontieres = false;
  }
}
function academyClosing(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE MESURE activée : Fermeture des écoles');
    board.allPlanets.forEach((planet) => {
      planet.moves[1] = 0;
    });
    board.allPublicPlaces.forEach((planet) => {
      planet.moves[1] = 0;
    });
    // retour des robots de la Robot Académie dans les maisons
    const pawns = board.robotAcademy.extractAllPawns();
    chainExec(pawns.map((pawn) =>
      () => (board.planetTokenAcquirePawn(pawn)),
    ));
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE MESURE désactivée : Fermeture des écoles');
    board.allPlanets.forEach((planet) => {
      planet.moves[1] = 2;
    });
    board.allPublicPlaces.forEach((planet) => {
      planet.moves[1] = 2;
    });
    // difficile de reremplir l'école
  }
}
function robopitalCampagne(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE MESURE activée : Déploiement d\'un Robopital de campagne');
    board.garageColA.addSlot(board, [ 1690, 737 ]);
    board.garageColB.addSlot(board, [ 1736, 737 ]);
    board.garageColC.addSlot(board, [ 1782, 737 ]);
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE MESURE désactivée : Déploiement d\'un Robopital de campagne');
    board.garageColA.removeSlot();
    board.garageColB.removeSlot();
    board.garageColC.removeSlot();
  }
}
function urgencyClosing(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE MESURE activée : Limitation des admissions aux urgences');
    board.levelRobopital = 5;
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE MESURE désactivée : Limitation des admissions aux urgences');
    board.levelRobopital = 4;
  }
}
function transportClosing(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE MESURE activée : Fermeture des transports en commun');
    board.allPlanets.forEach((planet) => {
      planet.moves[1] = Math.min(1, planet.moves[1]); // si l'académie est déjà fermée planet.moves[1] sera à 0
    });
    TypedPlanet.TYPES.forEach((planetType) => {
      const planet = board.rng.pickOne(board.planetsPerType[planetType]);
      board.desactivatedPlanets.push(planet);
      for (let i = 1; i < 6; i++) {
        planet.moves[i] = 0;
      }
    });
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    board.allPlanets.forEach((planet) => {
      planet.moves[1] = 2;
    });
    let planet = board.desactivatedPlanets.pop();
    while (planet) {
      for (let i = 1; i < 6; i++) {
        planet.moves[i] = 2;
      }
      planet = board.desactivatedPlanets.pop();
    }
  }
}

function marketClosing(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE MESURE activée : Fermeture Batterie Market');
    board.allPlanets.forEach((planet) => {
      planet.moves[5] = 0;
    });
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    board.allPlanets.forEach((planet) => {
      planet.moves[5] = 2;
    });
  }
}

function confinement(board, activation = true) { // BUG
  if (activation) {
    messageDesc(board, 'CARTE MESURE activée : Confinement');
    board.allPlanets.forEach((planet) => {
      planet.moves[2] = 0;
      planet.moves[3] = 0;
      const pawns = planet.extractPawns(1);
      const pawn = pawns[0];
      if (pawn) {
        console.debug('confinement : ', pawn);
        board.batterieMarketZ1.acquirePawn(pawn);
      }
    });
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE MESURE désactivée : Confinement');
    board.allPlanets.forEach((planet) => {
      planet.moves[2] = 2;
      planet.moves[3] = 2;
    });
  }
}

function limitMoveRight(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE MESURE activée : Limitation des déplacements 2');
    board.allPlanets.forEach((planet) => {
      planet.moves[2] = Math.min(1, planet.moves[2]);
    });
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    board.allPlanets.forEach((planet) => {
      planet.moves[2] = 2;
    });
  }
}

function limitMoveLeft(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE MESURE activée : Limitation des déplacements 3');
    board.allPlanets.forEach((planet) => {
      planet.moves[3] = Math.min(1, planet.moves[3]);
    });
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    board.allPlanets.forEach((planet) => {
      planet.moves[3] = 2;
    });
  }
}

function publicPlaceClosing(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE MESURE activée : Fermeture des lieux publics');
    board.allPlanets.forEach((planet) => {
      planet.moves[4] = 0;
      // Si la maison contient au - 4 robots, 1 robot est envoyé dans le lieu public de son quartier
      if (planet.getNumberPawns() > 3) {
        const pawns = planet.extractPawns(1);
        planet.publicPlanet.acquirePawn(pawns[0]);
      }
    });
    board.allPublicPlaces.forEach((planet) => {
      planet.closed = true;
      planet.moves[4] = 4;
      planet.moves[5] = 4;
    });
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    board.allPlanets.forEach((planet) => {
      planet.moves[4] = 2;
    });
    board.allPublicPlaces.forEach((planet) => {
      planet.closed = false;
      planet.moves[4] = 2;
      planet.moves[5] = 2;
    });
  }
}
