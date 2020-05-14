/* eslint-disable complexity */
// 1er déplacement des habitant.e.s
import { TypedPlanet, messageDesc } from './game-props.js';
import { nextTurnStep } from './game-sequence.js';
import { addPawnOnPlanet } from './init.js';
import { chainExec, wrapAnimDelay } from './promise-utils.js';
import { TurnStep } from './turn-step.js';

export class TurnStep1 extends TurnStep {
  constructor(board) {
    super();
    board.goOnButton.textContent = 'Effectuer le déplacement';
    board.buttonEnable();
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
  const planetTypes = { 'crater': 'Cratère', 'gaseous': 'Gaz', 'artificial': 'Circuit' };
  messageDesc(board, `[Étape 1] Planète ${ planetTypes[planetType] } - Résultat du dé:`, dieResult);
  if (dieResult === 6 && board.frontieres === true) { // gestion de la carte dépistage aux frontières
    return addPawnOnPlanet({ board, state: 'incubating', planet: board.planetTokenPlanet })
      .then(() => wrapAnimDelay(() => board.movePlanetTokenTo(board.planetTokenPlanet.nextPlanet)))
      .then(() => addPawnOnPlanet({ board, state: 'sane', planet: board.planetTokenPlanet }))
      .then(() => wrapAnimDelay(() => board.movePlanetTokenTo(board.planetTokenPlanet.nextPlanet)))
      .then(() => addPawnOnPlanet({ board, state: 'sane', planet: board.planetTokenPlanet }))
      .then(() => wrapAnimDelay(() => board.movePlanetTokenTo(board.planetTokenPlanet.nextPlanet)));
  } else if (dieResult === 6 && board.frontieres === false) { // gestion de la carte dépistage aux frontières
    return addPawnOnPlanet({ board, state: 'sane', planet: board.planetTokenPlanet })
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
      destPlace = board.batterieMarketZ1;
    }
    const [ pawn1, pawn2 ] = planet.extractPawns(planet.moves[dieResult]); // on bouge le nombre à bouger suivant les mesures prises (max=2)
    console.debug(`Moving from planet ${ planet.name } with type ${ planet.type }: ${ pawn1 && pawn1.state }, ${ pawn2 && pawn2.state }`);
    if (pawn1) {
      destPlace.acquirePawn(pawn1);
    }
    if (pawn2) {
      destPlace.acquirePawn(pawn2);
    }
  });
}

function moveToPlanets(board, publicPlace, dieResult) {
  // déplacer 1 robot dans chaque maison du quartier
  const pawns = publicPlace.extractPawns(publicPlace.moves[dieResult]);
  const planets = board.getAllPlanetsWithPublicPlace(publicPlace);
  let np = 0;
  planets.forEach((planet) => { // pour chaque planète
    const pawn = pawns.pop();
    if (pawn) {
      np++;
      planet.acquirePawn(pawn);
    }
  });
  messageDesc(board, `${ np } pion(s) se déplacent du ${ publicPlace.name } vers les maisons`);
}

function moveFromPublicPlace({ board, dieResult, publicPlace }) {
  return wrapAnimDelay(() => {
    let destPlace = null;
    if (dieResult === 1) {
      destPlace = board.robotAcademy;
    } else if (dieResult === 2) {
      moveToPlanets(board, publicPlace, dieResult);
    } else if (dieResult === 3) {
      moveToPlanets(board, publicPlace, dieResult);
    } else if (dieResult === 4) {
      // déplacer 2 robots dans le lieu public suivant
      if (publicPlace.closed === false) {
        destPlace = publicPlace.nextPlace;
      } else { // pour la carte mesures fermeture des lieux publics
        moveToPlanets(board, publicPlace, dieResult);
      }
    } else if (dieResult === 5) {
      // déplacer 2 robots dans le lieu public précédént
      if (publicPlace.closed === false) {
        destPlace = publicPlace.prevPlace;
      } else { // pour la carte mesures fermeture des lieux publics
        moveToPlanets(board, publicPlace, dieResult);
      }
    }
    if (destPlace) {
      const [ pawn1, pawn2 ] = publicPlace.extractPawns(publicPlace.moves[dieResult]);
      let np = 0;
      console.debug(`Moving from planet ${ publicPlace.name } with type ${ publicPlace.type }: ${ pawn1 && pawn1.state }, ${ pawn2 && pawn2.state }`);
      if (pawn1) {
        np++;
        destPlace.acquirePawn(pawn1);
      }
      if (pawn2) {
        np++;
        destPlace.acquirePawn(pawn2);
      }
      messageDesc(board, `${ np } pion(s) se déplacent du ${ publicPlace.name } vers ${ destPlace.name } `);
    }
  });
}
