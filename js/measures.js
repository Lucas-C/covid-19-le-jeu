import { SplashOverlay } from './animate.js';
import { MeasureCard, messageDesc } from './game-props.js';

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
