import { Board } from './board.js';
import { Pawn, Place, Planet, PlanetToken, PublicPlace, TypedPlanet } from './game-props.js';
import { chainExec, wrapAnimDelay } from './promise-utils.js';

export function initializeGame(doc, seed) {
  const board = initializeBoard(doc, seed);
  return addPawns(board).then(() => addTokens(board)).then(() => board);
}

function initializeBoard(doc, seed) {
  const board = new Board(doc, seed);
  // Enumération des planètes :
  // Zone en haut à gauche :
  const artificialPlanet = board.addPlanet(new Planet({ board, type: 'artificial', pos: [ 55, 75 ], slotsPos: [
    [ 115, 135 ], [ 155, 135 ], // 1ère rangée
    [ 115, 175 ], [ 155, 175 ], // 2e rangée
  ] }));
  const craterPlanet = board.addPlanet(new Planet({ board, type: 'crater', pos: [ 245, 10 ], slotsPos: [
    [ 305, 70 ], [ 345, 70 ], // 1ère rangée
    [ 305, 110 ], [ 345, 110 ], // 2e rangée
  ] }));
  const gaseousPlanet = board.addPlanet(new Planet({ board, type: 'gaseous', pos: [ 495, 25 ], slotsPos: [
    [ 555, 65 ], [ 595, 65 ], // 1ère rangée
    [ 555, 105 ], [ 595, 105 ], // 2e rangée
    [ 575, 145 ], // 3e rangée
  ] }));
  artificialPlanet.nextPlanet = craterPlanet;
  artificialPlanet.prevPlanet = gaseousPlanet;// FAUX, temporaire
  craterPlanet.prevPlanet = artificialPlanet;
  craterPlanet.nextPlanet = gaseousPlanet;
  gaseousPlanet.prevPlanet = craterPlanet;
  gaseousPlanet.nextPlanet = artificialPlanet; // FAUX, temporaire
  const bar = board.addPublicPlace(new PublicPlace({ board, pos: [ 350, 200 ], type: 'gaseous', slotsPos: [ [ 385, 290 ], [ 420, 272 ], [ 455, 254 ], [ 490, 236 ] ] })); // bar
  artificialPlanet.publicPlanet = bar;
  gaseousPlanet.publicPlanet = bar;
  craterPlanet.publicPlanet = bar;
  board.robotAcademy = new Place({ board, pos: [ 600, 330 ], cssClass: 'robot-academy', height: 250, width: 250, slotsPos: [
    [ 670, 420 ], [ 707, 420 ], [ 744, 420 ], [ 781, 420 ], // 1ère rangée
    [ 670, 455 ], [ 707, 455 ], [ 744, 455 ], [ 781, 455 ], // 2e rangée
  ] });
  board.robotAcademy.coefInfection = 4;
  board.batterieMarket = new Place({ board, pos: [ 1430, 300 ], cssClass: 'batterie-market', height: 220, width: 250, slotsPos: [
    [ 1453, 385 ], [ 1491, 385 ], [ 1529, 385 ], [ 1567, 385 ], [ 1605, 385 ], [ 1643, 385 ], // 1ère rangée
    [ 1453, 440 ], [ 1491, 440 ], [ 1529, 440 ], [ 1567, 440 ], [ 1605, 440 ], [ 1643, 440 ], // 2e rangée

  ] });
  board.garage = new Place({ board, pos: [ 1660, 480 ], cssClass: 'garage', height: 300, width: 175, slotsPos: [
    [ 1690, 552 ], [ 1736, 552 ], [ 1782, 552 ], // 1ère rangée
    [ 1690, 589 ], [ 1736, 589 ], [ 1782, 589 ], // 2e rangée
    [ 1690, 626 ], [ 1736, 626 ], [ 1782, 626 ], // 3e rangée
    [ 1690, 663 ], [ 1736, 663 ], [ 1782, 663 ],
    [ 1690, 700 ], [ 1736, 700 ], [ 1782, 700 ],
  ] });
  board.publicPlacesPerType.artificial = []; // temporaire
  board.publicPlacesPerType.crater = []; // temporaire
  return board;
}

function addPawns(board) {
  const allSanePawns = []; // On crée tous les pions "sain" initiaux
  board.allPlanets.forEach((planet) => planet.slots.forEach(() => allSanePawns.push(new Pawn({ board, state: 'sane' }))));
  // On déclenche leur mouvement d'un coup vers toutes les planètes :
  return wrapAnimDelay(() => board.allPlanets.forEach((planet) => planet.slots.forEach(() => planet.acquirePawn(allSanePawns.pop()))))
    .then(() => chainExec(TypedPlanet.TYPES.map((planetType) =>
    // Puis on place un pion "incubé" par planète de chaque type
      () => addPawnOnPlanet({ board, state: 'incubating', planet: board.rng.pickOne(board.planetsPerType[planetType]) }),
    )));
}

export function addPawnOnPlanet({ board, state, planet }) {
  const pawn = new Pawn({ board, state });
  return wrapAnimDelay(() => planet.acquirePawn(pawn));
}

function addTokens(board) {
  board.planetToken = new PlanetToken({ board });
  const randomPlanet = board.rng.pickOne(board.allPlanets);
  return wrapAnimDelay(() => board.movePlanetTokenTo(randomPlanet));
  // TODO: ajouter les marqueurs de tour
}
