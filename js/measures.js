import { SplashOverlay } from './animate.js';
import { MeasureCard, messageDesc, TypedPlanet } from './game-props.js';

export class MeasuresOverlay extends SplashOverlay {
  constructor(doc) {
    super(doc, 'measures-overlay');
  }
}

export class EndOverlay extends SplashOverlay {
  constructor(doc) {
    super(doc, 'end-overlay');
  }
}

export function initMeasuresCards(board) {
  board.allMeasures.push(MeasureCard(board, 'fermeture-lieu-public', publicPlaceClosing));
  board.allMeasures.push(MeasureCard(board, 'limitation-deplacement-antihor', limitMoveLeft));
  board.allMeasures.push(MeasureCard(board, 'limitation-deplacement-hor', limitMoveRight));
  board.allMeasures.push(MeasureCard(board, 'confinement', confinement));
  board.allMeasures.push(MeasureCard(board, 'fermeture-batterie-market', marketClosing));
  board.allMeasures.push(MeasureCard(board, 'fermeture-transports', transportClosing));
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

function confinement(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE MESURE activée : Confinement');
    board.allPlanets.forEach((planet) => {
      planet.moves[2] = 0;
      planet.moves[3] = 0;
      const pawn = planet.extractPawns(1);
      board.batterieMarketZ1.acquirePawn(pawn);
    });
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
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
