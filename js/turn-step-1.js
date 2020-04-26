// 1er déplacement des habitant.e.s

import { TypedPlanet } from './game-props.js';
import { nextTurnStep } from './game-sequence.js';
import { addPawnOnPlanet } from './init.js';
import { chainExec, wrapAnimDelay } from './promise-utils.js';
import { TurnStep } from './turn-step.js';

export class TurnStep1 extends TurnStep {
  constructor(board) {
    super();
    board.goOnButton.textContent = 'Effectuer le déplacement';
    board.goOnCallback = () => moveAllPawns(board).then(() => nextTurnStep(board));
  }
  getStepName() {
    return '1er déplacement des habitant.e.s';
  }
}

function moveAllPawns(board) {
  return chainExec(TypedPlanet.TYPES.map((planetType) =>
    () => moveAllPlanetsOfType({ board, planetType }),
  ));
}

function moveAllPlanetsOfType({ board, planetType }) {
  const dieResult = board.rng.rollDie();
  console.log('[Étape 1] Résultat du dé:', dieResult);
  if (dieResult === 6) {
    return addPawnOnPlanet({ board, state: 'incubating', planet: board.planetTokenPlanet })
      .then(() => wrapAnimDelay(() => board.movePlanetTokenTo(board.planetTokenPlanet.nextPlanet)))
      .then(() => addPawnOnPlanet({ board, state: 'sane', planet: board.planetTokenPlanet }))
      .then(() => wrapAnimDelay(() => board.movePlanetTokenTo(board.planetTokenPlanet.nextPlanet)))
      .then(() => addPawnOnPlanet({ board, state: 'sane', planet: board.planetTokenPlanet }))
      .then(() => wrapAnimDelay(() => board.movePlanetTokenTo(board.planetTokenPlanet.nextPlanet)));
  }
  return chainExec(board.planetsPerType[planetType].map((planet) =>
    () => moveFromPlanet({ board, dieResult, planet }),
  )).then(() => chainExec(board.publicPlacesPerType[planetType].map((publicPlace) =>
    () => moveFromPublicPlace({ board, dieResult, publicPlace })),
  ));
}

function moveFromPlanet({ board, dieResult, planet }) {
  return wrapAnimDelay(() => {
    let destPlace = null;
    if (dieResult === 1) {
      destPlace = board.robotAcademy;
    } else if (dieResult === 2) {
      destPlace = planet.nextPlanet;
    } else if (dieResult === 3) {
      destPlace = planet.prevPlanet;
    } else if (dieResult === 4) {
      destPlace = planet.publicPlanet;
    } else if (dieResult === 5) {
      destPlace = board.batterieMarket;
    }
    const [ pawn1, pawn2 ] = planet.extractPawns(2);
    console.debug(`Moving from planet with type ${ planet.type }: ${ pawn1 && pawn1.state }, ${ pawn2 && pawn2.state }`);
    if (pawn1) {
      destPlace.acquirePawn(pawn1);
    }
    if (pawn2) {
      destPlace.acquirePawn(pawn2);
    }
    console.debug('=== Pions ===');
    console.debug(destPlace.slots);
  });
}

/*eslint-disable */
function moveFromPublicPlace({ board, dieResult, publicPlace }) {
  // TODO
}
