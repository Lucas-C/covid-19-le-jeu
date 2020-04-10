
const DELAY_BEFORE_DISAPEARING = 5000; // ms

export function rollDice({ board, numberOfDice }) {
  const delay = DELAY_BEFORE_DISAPEARING;
  const element = board.doc.getElementsByClassName('dice')[0];
  return new Promise((callback) => rollADie({ element, numberOfDice, callback, delay }));
}
