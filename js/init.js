import { Board } from './board.js';
import { Pawn, Place, Planet, PlanetToken, RoundToken, CrisisToken, PublicPlace, TypedPlanet } from './game-props.js';
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
  // const Gaz2 = board.addPlanet(new Planet({ board, type: 'gaseous', pos: [ 1283, 160 ], slotsPos: [ [ 1225, 125 ], [ 1265, 125 ], [ 1225, 165 ], [ 1265, 165 ], [ 1305, 125 ], [ 1305, 165 ] ] }));
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
  board.batterieMarketZ1 = new Place({ board, pos: [ 1400, 340 ], cssClass: 'batterie-market', height: 110, width: 250, slotsPos: [ [ 1416, 402 ], [ 1454, 402 ], [ 1492, 402 ], [ 1530, 402 ], [ 1568, 402 ], [ 1606, 402 ] ] });
  board.batterieMarketZ2 = new Place({ board, pos: [ 1400, 450 ], cssClass: 'batterie-market', height: 110, width: 250, slotsPos: [ [ 1416, 495 ], [ 1454, 495 ], [ 1492, 495 ], [ 1530, 495 ], [ 1568, 495 ], [ 1606, 495 ] ] });
  board.garageColA = new Place({ board, pos: [ 1680, 500 ], cssClass: 'garage', height: 300, width: 50, slotsPos: [
    [ 1690, 552 ],
    [ 1690, 589 ],
    [ 1690, 626 ],
    [ 1690, 663 ],
    [ 1690, 700 ],
    [ 1690, 737 ],
  ] });
  board.garageColB = new Place({ board, pos: [ 1726, 500 ], cssClass: 'garage', height: 300, width: 50, slotsPos: [
    [ 1736, 552 ],
    [ 1736, 589 ],
    [ 1736, 626 ],
    [ 1736, 663 ],
    [ 1736, 700 ],
    [ 1736, 737 ],
  ] });
  board.garageColC = new Place({ board, pos: [ 1772, 500 ], cssClass: 'garage', height: 300, width: 50, slotsPos: [
    [ 1782, 552 ],
    [ 1782, 589 ],
    [ 1782, 626 ],
    [ 1782, 663 ],
    [ 1782, 700 ],
    [ 1782, 737 ],
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
  board.roundToken = new RoundToken({ board });
  board.crisisToken = new CrisisToken({ board });
  const randomPlanet = board.rng.pickOne(board.allPlanets);
  return wrapAnimDelay(() => board.movePlanetTokenTo(randomPlanet));
}
