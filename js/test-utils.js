/* eslint no-empty-function: "off" */
import { RandomGenerator } from './random.js';

const MOCK_ELEM = {
  appendChild: () => {},
  classList: {
    add: () => {},
  },
  style: {},
};

export const MOCK_BOARD = {
  doc: {
    createElement: () => MOCK_ELEM,
  },
  elem: MOCK_ELEM,
  rng: new RandomGenerator(42),
};
