/* eslint max-statements: ["error", 100, { "ignoreTopLevelFunctions": true }] */
import { Board } from './board.js';
import { Pawn, Place, Planet, PlanetToken, RoundToken, CrisisToken, PublicPlace, TypedPlanet, messageDesc } from './game-props.js';
import { chainExec, wrapAnimDelay } from './promise-utils.js';
import { SplashOverlay } from './animate.js';
import { initMeasuresCards } from './measures.js';
import { initEventsCards } from './events.js';
import { enableFastAnimations } from './timing.js';

export async function launcher(doc, seed) {
  const board = initializeBoard(doc, seed);
  await introduction(doc, board);
  while (board.intro === true) {
    await new Promise((res) => setTimeout(res, 50));
  }
  board.intro = true;
  return addPawns(board).then(() => addTokens(board)).then(() => board);
}
function introduction(doc, board) {
  const intro = new SplashOverlay(doc, 'intro-overlay');
  doc.getElementById('play').onclick = () => {
    intro.toggleDisplay();
    if (document.querySelector('#fast_mode:checked') !== null) {
      enableFastAnimations();
    }
    board.intro = false;
  };
  intro.toggleDisplay();
}
export function initializeGame(doc, seed) {
  const board = initializeBoard(doc, seed);
  return addPawns(board).then(() => addTokens(board)).then(() => board);
}

function initializeBoard(doc, seed) {
  const board = new Board(doc, seed);
  initMeasuresCards(board);
  initEventsCards(board);
  // Enumération des planètes :
  // Zone en haut à gauche pour le text :
  /* const artificialPlanet = board.addPlanet(new Planet({ board, type: 'artificial', pos: [ 55, 75 ], slotsPos: [
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
  craterPlanet.publicPlanet = bar;*/
  // toutes les planetes
  const gaz1 = board.addPlanet(new Planet({ board, type: 'gaseous', pos: [ 500, 28 ], slotsPos: [ [ 556, 65 ], [ 596, 65 ], [ 556, 105 ], [ 596, 105 ], [ 576, 145 ] ], name: 'Gaz 1' }));
  const gaz2 = board.addPlanet(new Planet({ board, type: 'gaseous', pos: [ 1180, 73 ], slotsPos: [ [ 1217, 128 ], [ 1257, 128 ], [ 1217, 168 ], [ 1257, 168 ], [ 1297, 128 ], [ 1297, 168 ] ], name: 'Gaz 2' }));
  const gaz3 = board.addPlanet(new Planet({ board, type: 'gaseous', pos: [ 1123, 456 ], slotsPos: [ [ 1182, 514 ], [ 1222, 514 ], [ 1182, 554 ], [ 1222, 554 ] ], name: 'Gaz 3' }));
  const gaz4 = board.addPlanet(new Planet({ board, type: 'gaseous', pos: [ 489, 697 ], slotsPos: [ [ 572, 777 ] ], name: 'Gaz 4' }));
  const gaz5 = board.addPlanet(new Planet({ board, type: 'gaseous', pos: [ 63, 440 ], slotsPos: [ [ 117, 497 ], [ 156, 497 ], [ 117, 537 ], [ 156, 537 ] ], name: 'Gaz 5' }));
  const cratere1 = board.addPlanet(new Planet({ board, type: 'crater', pos: [ 243, 12 ], slotsPos: [ [ 304, 71 ], [ 343, 71 ], [ 304, 111 ], [ 343, 111 ] ], name: 'Cratère 1' }));
  const cratere2 = board.addPlanet(new Planet({ board, type: 'crater', pos: [ 982, 2 ], slotsPos: [ [ 1058, 77 ] ], name: 'Cratère 2' }));
  const cratere3 = board.addPlanet(new Planet({ board, type: 'crater', pos: [ 1150, 631 ], slotsPos: [ [ 1234, 684 ], [ 1234, 722 ] ], name: 'Cratère 3' }));
  const cratere4 = board.addPlanet(new Planet({ board, type: 'crater', pos: [ 735, 658 ], slotsPos: [ [ 768, 727 ], [ 807, 727 ], [ 848, 727 ] ], name: 'Cratère 4' }));
  const cratere5 = board.addPlanet(new Planet({ board, type: 'crater', pos: [ 48, 632 ], slotsPos: [ [ 125, 686 ], [ 125, 725 ] ], name: 'Cratère 5' }));
  const cratere6 = board.addPlanet(new Planet({ board, type: 'crater', pos: [ 118, 251 ], slotsPos: [ [ 170, 292 ], [ 210, 292 ], [ 170, 332 ], [ 210, 332 ], [ 190, 372 ] ], name: 'Cratère 1' }));
  const circuit1 = board.addPlanet(new Planet({ board, type: 'artificial', pos: [ 61, 71 ], slotsPos: [ [ 115, 176 ], [ 155, 176 ], [ 115, 136 ], [ 155, 136 ] ], name: 'Circuit 1' }));
  const circuit2 = board.addPlanet(new Planet({ board, type: 'artificial', pos: [ 762, 57 ], slotsPos: [ [ 802, 140 ], [ 841, 140 ], [ 882, 140 ] ], name: 'Circuit 2' }));
  const circuit3 = board.addPlanet(new Planet({ board, type: 'artificial', pos: [ 1140, 272 ], slotsPos: [ [ 1200, 332 ], [ 1240, 332 ], [ 1200, 372 ], [ 1240, 372 ] ], name: 'Circuit 3' }));
  const circuit4 = board.addPlanet(new Planet({ board, type: 'artificial', pos: [ 965, 694 ], slotsPos: [ [ 1020, 744 ], [ 1060, 744 ], [ 1021, 784 ], [ 1060, 784 ], [ 1040, 824 ] ], name: 'Circuit 4' }));
  const circuit5 = board.addPlanet(new Planet({ board, type: 'artificial', pos: [ 248, 720 ], slotsPos: [ [ 280, 779 ], [ 320, 779 ], [ 280, 819 ], [ 320, 819 ], [ 360, 779 ], [ 360, 819 ] ], name: 'Circuit 5' }));
  const bar = board.addPublicPlace(new PublicPlace({ board, pos: [ 356, 198 ], type: 'gaseous', slotsPos: [ [ 422, 273 ], [ 458, 256 ], [ 384, 289 ], [ 494, 238 ] ], name: 'Bar' }));
  const cinema = board.addPublicPlace(new PublicPlace({ board, pos: [ 901, 212 ], type: 'crater', slotsPos: [ [ 933, 297 ], [ 972, 297 ], [ 933, 337 ], [ 972, 337 ] ], name: 'Cinéma' }));
  const musee = board.addPublicPlace(new PublicPlace({ board, pos: [ 903, 482 ], type: 'gaseous', slotsPos: [ [ 949, 504 ], [ 967, 539 ], [ 931, 467 ], [ 986, 574 ] ], name: 'Musée' }));
  const restaurant = board.addPublicPlace(new PublicPlace({ board, pos: [ 343, 496 ], type: 'crater', slotsPos: [ [ 398, 560 ], [ 435, 588 ], [ 376, 530 ], [ 465, 617 ] ], name: 'Restaurant' }));
  // chainage
  gaz5.nextPlanet = cratere6;
  gaz5.prevPlanet = cratere5;
  gaz5.publicPlanet = restaurant;
  gaz4.nextPlanet = circuit5;
  gaz4.prevPlanet = cratere4;
  gaz4.publicPlanet = restaurant;
  gaz3.nextPlanet = cratere3;
  gaz3.prevPlanet = circuit3;
  gaz3.publicPlanet = musee;
  gaz2.nextPlanet = circuit3;
  gaz2.prevPlanet = cratere2;
  gaz2.publicPlanet = cinema;
  gaz1.nextPlanet = circuit2;
  gaz1.prevPlanet = cratere1;
  gaz1.publicPlanet = bar;
  //
  cratere6.nextPlanet = circuit1;
  cratere6.prevPlanet = gaz5;
  cratere6.publicPlanet = bar;
  cratere5.nextPlanet = gaz5;
  cratere5.prevPlanet = circuit5;
  cratere5.publicPlanet = restaurant;
  cratere4.nextPlanet = gaz4;
  cratere4.prevPlanet = circuit4;
  cratere4.publicPlanet = musee;
  cratere3.nextPlanet = circuit4;
  cratere3.prevPlanet = gaz3;
  cratere3.publicPlanet = musee;
  cratere2.nextPlanet = gaz2;
  cratere2.prevPlanet = circuit2;
  cratere2.publicPlanet = cinema;
  cratere1.nextPlanet = gaz1;
  cratere1.prevPlanet = circuit1;
  cratere1.publicPlanet = bar;
  //
  circuit5.nextPlanet = cratere5;
  circuit5.prevPlanet = gaz4;
  circuit5.publicPlanet = restaurant;
  circuit4.nextPlanet = cratere4;
  circuit4.prevPlanet = cratere3;
  circuit4.publicPlanet = musee;
  circuit3.nextPlanet = gaz3;
  circuit3.prevPlanet = gaz2;
  circuit3.publicPlanet = cinema;
  circuit2.nextPlanet = cratere2;
  circuit2.prevPlanet = gaz1;
  circuit2.publicPlanet = cinema;
  circuit1.nextPlanet = cratere1;
  circuit1.prevPlanet = cratere6;
  circuit1.publicPlanet = bar;
  //
  bar.nextPlace = cinema;
  bar.prevPlace = restaurant;
  cinema.nextPlace = musee;
  cinema.prevPlace = bar;
  musee.nextPlace = restaurant;
  musee.prevPlace = cinema;
  restaurant.nextPlace = bar;
  restaurant.prevPlace = musee;
  /**************************************/
  board.robotAcademy = new Place({ board, pos: [ 610, 345 ], cssClass: 'robot-academy', height: 250, width: 250, slotsPos: [ [ 672, 422 ], [ 709, 422 ], [ 672, 459 ], [ 709, 459 ], [ 746, 422 ], [ 781, 422 ], [ 746, 459 ], [ 781, 459 ] ], name: 'Robot Académie' });
  board.robotAcademy.coefInfection = 4;
  board.batterieMarketZ1 = new Place({ board, pos: [ 1400, 340 ], cssClass: 'batterie-market', height: 110, width: 250, slotsPos: [ [ 1416, 402 ], [ 1454, 402 ], [ 1492, 402 ], [ 1530, 402 ], [ 1568, 402 ], [ 1606, 402 ] ], name: 'BatterieMarket Zone 1' });
  board.batterieMarketZ2 = new Place({ board, pos: [ 1400, 450 ], cssClass: 'batterie-market', height: 110, width: 250, slotsPos: [ [ 1416, 495 ], [ 1454, 495 ], [ 1492, 495 ], [ 1530, 495 ], [ 1568, 495 ], [ 1606, 495 ] ], name: 'BatterieMarket Zone 2' });
  board.batterieMarketZ2.closed = false;
  board.garageColA = new Place({ board, pos: [ 1680, 500 ], cssClass: 'garage', height: 300, width: 50, slotsPos: [
    [ 1690, 552 ],
    [ 1690, 589 ],
    [ 1690, 626 ],
    [ 1690, 663 ],
    [ 1690, 700 ],
    // [ 1690, 737 ],
  ], name: 'Robopital Col A' });
  // board.garageColA.addSlot(board, [ 1690, 737 ]); // Test
  board.garageColB = new Place({ board, pos: [ 1726, 500 ], cssClass: 'garage', height: 300, width: 50, slotsPos: [
    [ 1736, 552 ],
    [ 1736, 589 ],
    [ 1736, 626 ],
    [ 1736, 663 ],
    [ 1736, 700 ],
    // [ 1736, 737 ],
  ], name: 'Robopital Col B' });
  board.garageColC = new Place({ board, pos: [ 1772, 500 ], cssClass: 'garage', height: 300, width: 50, slotsPos: [
    [ 1782, 552 ],
    [ 1782, 589 ],
    [ 1782, 626 ],
    [ 1782, 663 ],
    [ 1782, 700 ],
    // [ 1782, 737 ],
  ], name: 'Robopital Col C' });
  board.publicPlacesPerType.artificial = []; // temporaire
  board.publicPlacesPerType.crater = []; // temporaire
  messageDesc(board, 'Initialisation du jeu...');
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
