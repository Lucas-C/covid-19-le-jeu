import { initializeGame } from './init.js';

if (typeof window !== 'undefined') { // == le code est exécuté dans un navigateur
  initializeGame(document);
}
