import { Board, House, Pawn } from './game-props.js';
import { rollDice } from './dice.js';
import { delay } from './timing.js';

export function initializeGame(doc) {
  const board = initializeBoard(doc);
  addIncubatingPawns(board);
}

function initializeBoard(doc) {
  const board = new Board(doc);
  // Enumération des maisons, ligne par ligne, de gauche à droite :
  board.addHouse(new House({ board, number: 3, pos: [ 58, 58 ], slotsPos: [ // maison violette
    [ 64, 68 ], [ 90, 68 ], [ 136, 68 ], // 1ère rangée
    [ 64, 106 ], // 2e rangée
  ] }));
  return board;
}

function addIncubatingPawns(board) {
  rollDice({ board, numberOfDice: 3 })
    .then(delay({ ms: 1000 }))
    .then((results) => addSingleIncubatingPawn({ board, houseNumber: sum(results) }))

    .then(() => rollDice({ board, numberOfDice: 3 }))
    .then(delay({ ms: 1000 }))
    .then((results) => addSingleIncubatingPawn({ board, houseNumber: sum(results) }))

    .then(() => rollDice({ board, numberOfDice: 3 }))
    .then(delay({ ms: 1000 }))
    .then((results) => addSingleIncubatingPawn({ board, houseNumber: sum(results) }));
}

function addSingleIncubatingPawn({ board, houseNumber }) {
  const randomHouse = houseNumber < 3 ? board.housePerNumber[houseNumber] : board.housePerNumber[3]; // temporaire, tant que initializeBoard n'est pas finalisé
  const incubatingPawn = new Pawn({ board, state: 'INCUBATING' });
  // On délaie légèrement l'ajout à chaque maison pour déclencher l'animation:
  return delay({ ms: 200 })().then(() => randomHouse.putIn(incubatingPawn));
}

function sum(numbers) {
  return numbers.reduce((a, b) => a + b);
}
