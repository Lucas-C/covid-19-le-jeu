/* global expect, test*/
/* eslint no-magic-numbers: "off" */

/* import { Place, Pawn } from './game-props.js'; */
import { MOCK_BOARD } from './test-utils.js';

test('fake', () => {
  const board = MOCK_BOARD;
  expect(board).toBeTruthy();
});

/*
test('acquirePawn accepte des pions au-delà de la capacité du lieu', () => {
  const board = MOCK_BOARD;
  const testPlace = new Place({ board, pos: [ 0, 0 ], cssClass: 'test', height: 10, width: 10, slotsPos: [ [ 1, 1 ], [ 2, 2 ] ], name: 'testPlace' });
  testPlace.acquirePawn(new Pawn({ board }));
  testPlace.acquirePawn(new Pawn({ board }));
  testPlace.acquirePawn(new Pawn({ board }));
  expect(testPlace.getFreeSlots().length).toStrictEqual(0);
  expect(testPlace.extraPawns.length).toStrictEqual(1);
});

test('extractPawns retourne le nombre d\'éléments requis mais certains peuvent être null', () => {
  const board = MOCK_BOARD;
  const testPlace = new Place({ board, pos: [ 0, 0 ], cssClass: 'test', height: 10, width: 10, slotsPos: [ [ 1, 1 ], [ 2, 2 ] ], name: 'testPlace' });
  testPlace.acquirePawn(new Pawn({ board }));
  const extractedPawns = testPlace.extractPawns(2);
  expect(extractedPawns.length).toStrictEqual(2);
  expect(extractedPawns[0]).toBeTruthy();
  expect(extractedPawns[1]).toBeNull();
  expect(testPlace.getFreeSlots().length).toStrictEqual(2);
});
*/