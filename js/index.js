import { initializeGame } from './init.js';
import { nextTurnStep } from './game-sequence.js';
import { enableFastAnimations } from './timing.js';
import { randomSeedWord } from './random.js';

if (typeof window !== 'undefined') { // == le code est exécuté dans un navigateur
  const queryParams = new URLSearchParams(location.search);
  if (queryParams.get('debug')) {
    document.body.classList.add('debug');
  }
  if (queryParams.get('fast')) {
    enableFastAnimations();
  }
  const seed = queryParams.get('seed') || randomSeedWord();
  initializeGame(document, seed).then(nextTurnStep);
}
