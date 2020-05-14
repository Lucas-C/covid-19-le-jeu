import { EventCard, messageDesc } from './game-props.js';
// import { chainExec } from './promise-utils.js';

export function initEventsCards(board) {
  board.allMeasures.push(new EventCard(board, 'saison-festivals', tempEvent));
  board.allMeasures.push(new EventCard(board, 'contamination-market', tempEvent));
  board.allMeasures.push(new EventCard(board, 'repas-amis', tempEvent));
  board.allMeasures.push(new EventCard(board, 'groupe-voyageurs', tempEvent));
  board.allMeasures.push(new EventCard(board, 'contamination-lieux-publics', tempEvent));
  board.allMeasures.push(new EventCard(board, 'harry-botter', tempEvent));
  board.allMeasures.push(new EventCard(board, 'penurie-masque', tempEvent));
  board.allMeasures.push(new EventCard(board, 'escroquerie-materiel', tempEvent));
  board.allMeasures.push(new EventCard(board, 'robot-academie', tempEvent));
  board.allMeasures.push(new EventCard(board, 'volontaires', tempEvent));
  board.allMeasures.push(new EventCard(board, 'confiance', tempEvent));
  board.allMeasures.push(new EventCard(board, 'desinformation', tempEvent));
}
function tempEvent(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE EVENEMENT jouée : XXX');
    // TO-DO
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE EVENEMENT désactivée : XXX');
    // TO-DO
  }
}
