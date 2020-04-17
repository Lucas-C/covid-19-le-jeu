import { Board, Pawn, Planet, PlanetToken } from './game-props.js';
import { delay, MS } from './timing.js';

export function initializeGame(doc, seed) {
  const board = initializeBoard(doc, seed);
  return addIncubatingPawns(board).then(() => addTokens(board)).then(() => board);
}

function initializeBoard(doc, seed) {
  const board = new Board(doc, seed);
  // Enumération des maisons, ligne par ligne, de gauche à droite :
  board.addPlanet(new Planet({ board, type: 'crater', pos: [ 58, 58 ], slotsPos: [
    [ 64, 68 ], [ 90, 68 ], [ 136, 68 ], // 1ère rangée
    [ 64, 106 ], // 2e rangée
  ] }));
  return board;
}

function addIncubatingPawns(board) {
  return animatedPutPawnOnPlanet({ pawn: new Pawn({ board, state: 'INCUBATING' }),
    randomPlanet: board.rng.pickOne(board.planetsPerType.crater) });
  // TODO: à répéter pour chaque type de planète
  // .then(() => animatedPutPawnOnPlanet({pawn: new Pawn({ board, state: 'INCUBATING' }),
  //                                     randomPlanet: board.rng.pickOne(board.planetsPerType.?)})
}

function addTokens(board) {
  return animatedPutPawnOnPlanet({ pawn: new PlanetToken({ board }),
    randomPlanet: board.rng.pickOne(board.allPlanets) });
  // TODO: ajouter les marqueurs de tour
}

function animatedPutPawnOnPlanet({ pawn, randomPlanet }) {
  return delay({ ms: MS.ADD_INCUBATING_PAWN_DELAY })() // On délaie légèrement l'ajout à chaque maison pour déclencher l'animation CSS
    .then(() => randomPlanet.putIn(pawn))
    .then(delay({ ms: MS.PAWN_MOVE_ANIMATION_DURATION })); // On attend la fin de l'animation CSS
}
