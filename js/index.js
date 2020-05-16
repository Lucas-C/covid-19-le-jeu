import { launcher } from './init.js';
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
  document.getElementById('terminal').addEventListener('click', descFullscreen);
  launcher(document, seed).then(nextTurnStep);
  // initializeGame(document, seed).then(nextTurnStep);
}

function descFullscreen() {
  const elem = document.querySelector('#terminal');
  console.debug(document.fullscreenElement);
  if (document.fullscreenElement === null) {
    elem.requestFullscreen().catch((err) => {
      console.debug(`Error attempting to enable full-screen mode: ${ err.message } (${ err.name })`);
    });
  } else {
    document.exitFullscreen();
  }
}
