/* eslint-disable complexity */
export const INITIAL_PAWNS_POS = [ 0, 0 ];
const INITIAL_ROUND_POS = [ 1476, 93 ];
const INITIAL_CRISIS_POS = [ 1676, 142 ];
const VERSION = 'Codroïd-19 | Jouer en ligne | D4';
// import { chainExec, wrapAnimDelay } from './promise-utils.js';

// Un élément "physique" du jeu
// Cette classe a la responsabilité de le placer & de l'animer à l'écran
class GameProp {
  constructor({ board, pos, cssClass, height, width }) {
    document.title = VERSION;
    this.elem = board.doc.createElement('div');
    // Tous les élements sont enfants d'un même parent pour pouvoir animer leurs changements positions left/top :
    board.elem.appendChild(this.elem);
    this.elem.style.position = 'absolute';
    this.height = height;
    this.width = width;
    this.elem.style.height = `${ this.height }px`;
    this.elem.style.width = `${ this.width }px`;
    this.elem.classList.add('game-prop');
    this.elem.classList.add(cssClass);
    this.setPos(pos);
  }
  setPos(pos) {
    this.elem.style.left = `${ pos[0] }px`;
    this.elem.style.top = `${ pos[1] }px`;
  }
  getPos() {
    return [ Number(this.elem.style.left.slice(0, -2)), Number(this.elem.style.top.slice(0, -2)) ];
  }
}

// Un emplacement de pion dans un lieu
class PlaceSlot extends GameProp {
  constructor({ board, pos, cssClass }) {
    super({ board, pos, cssClass, height: 25, width: 25 });
  }
}

// Un lieu pouvant héberger des pions
export class Place extends GameProp {
  constructor({ board, pos, cssClass, slotsPos, height, width }) { // slotsPos correspond aux coordonnés des emplacements de pion sur le bâtiment
    super({ board, pos, cssClass, height, width });
    this.rng = board.rng;
    this.coefInfection = 2; // nombre d'infectés par malade
    // Les pions sont toujours stockés en priorité dans les emplacements du lieu :
    this.slots = slotsPos.map((slotPos) => new PlaceSlot({ board, pos: slotPos, cssClass: 'slot' }));
    // Les pions supplémentaires sont listés dans cet attribut :
    this.extraPawns = [];
    // image de contamination
    const contaminedImg = document.createElement('img');
    contaminedImg.setAttribute('src', 'assets/contamined.png');
    contaminedImg.setAttribute('width', this.width + 30);
    contaminedImg.setAttribute('height', this.height + 30);
    contaminedImg.setAttribute('style', 'margin-top:-15px;margin-left:-15px;');
    contaminedImg.classList.add('no-contamined');
    this.elem.appendChild(contaminedImg);
  }
  isContaminated() { // s'il y a des pions en extra et au moins un malade dans le lieu, alors le lieu est contaminé
    if (this.extraPawns.length > 0 && this.getAllPawnsWithState('sick').length > 0) {
      const imgContamined = this.elem.childNodes[0];
      imgContamined.classList.remove('no-contamined');
      imgContamined.classList.add('contamined');
      return true;
    }
    const imgContamined = this.elem.childNodes[0];
    imgContamined.classList.add('no-contamined');
    imgContamined.classList.remove('contamined');
    return false;
  }
  getNumberPawns() {
    const freeSlots = this.getFreeSlots();
    const nbFullSlots = this.slots.length - freeSlots.length;
    return nbFullSlots + this.extraPawns.length;
  }
  acquirePawn(pawn) { 
    const freeSlots = this.getFreeSlots();
    if (freeSlots.length) {
      freeSlots[0].pawn = pawn;
      pawn.setPos(freeSlots[0].getPos());
    } else {
      this.extraPawns.push(pawn);
      pawn.setPos(this.getRandomPos(pawn));
    }
  }
  extractAllPawns(mode = 2) {
    const count = this.getNumberPawns();
    return this.extractPawns(count, mode);
  }
  extractPawns(count, mode = 1) {
    // cf. https://github.com/covid19lejeu/covid-19-le-jeu/blob/master/PRINCIPE_DU_JEU.md#priorit%C3%A9-de-d%C3%A9placement-
    // TODO : implémenter les règles correspondant au 2e déplacement
    const extractedPawns = [];
    switch (mode) {
      case 2:
        for (let i = 0; i < count; i++) {
          extractedPawns.push(this.extractPawnWithState('sick') || this.extractPawnWithState('incubating') || this.extractPawnWithState('sane') || this.extractPawnWithState('healed'));
        }
        break;
      default:
      case 1:
        for (let i = 0; i < count; i++) {
          if (i === 1) { // le 2eme est un incubating
            extractedPawns.push(this.extractPawnWithState('incubating') || this.extractPawnWithState('sane') || this.extractPawnWithState('sick') || this.extractPawnWithState('healed'));
          } else {
            extractedPawns.push(this.extractPawnWithState('healed') || this.extractPawnWithState('sane') || this.extractPawnWithState('incubating') || this.extractPawnWithState('sick'));
          }
        }
        break;
    }
    return extractedPawns;
  }
  extractAllPawnsWithState(state, extractedPawns = []) {
    // const extractedPawns = [];
    const p = this.extractPawnWithState(state);
    if (p !== null) {
      extractedPawns.push(p);
      this.extractAllPawnsWithState(state, extractedPawns);
    }
    return extractedPawns;
  }
  getAllPawnsWithState(state) {
    const extraMatchingPawn = this.extraPawns.find((pawn) => pawn.state === state);
    const slotWithMatchingPawn = this.slots.find((slot) => slot.pawn && slot.pawn.state === state);
    /* console.debug('=== getAllPawnsWithState ===',state);
    console.debug('Planète ===',this);
    console.debug('extraMatchingPawn : ', extraMatchingPawn);
    console.debug('slotWithMatchingPawn : ', slotWithMatchingPawn);*/
    let matchingExtraPawns = [];
    const matchingSlotPawns = [];
    if (extraMatchingPawn) {
      matchingExtraPawns = this.extraPawns.filter((pawn) => pawn.state === state);
      // console.debug('matchingExtraPawns : ', matchingExtraPawns);
    }
    if (slotWithMatchingPawn) {
      const matchingSlots = this.slots.filter((slot) => slot.pawn && slot.pawn.state === state);
      // console.debug('slots concernés :',matchingSlots);
      matchingSlots.forEach((slot) => matchingSlotPawns.push(slot.pawn));
      // console.debug('matchingSlotPawns : ', matchingSlotPawns);
    }
    const matchingPawns = matchingSlotPawns.concat(matchingExtraPawns);
    // console.debug('matchingPawns : ', matchingPawns);
    return matchingPawns;
  }
  extractPawn(thePawn) { // extrait un pion en particulier
    const extraMatchingPawn = this.extraPawns.find((pawn) => pawn === thePawn);
    if (extraMatchingPawn) {
      this.extraPawns = this.extraPawns.filter((pawn) => pawn !== extraMatchingPawn);
      return extraMatchingPawn;
    }
    const slotWithMatchingPawn = this.slots.find((slot) => slot.pawn && slot.pawn === thePawn);
    if (slotWithMatchingPawn) {
      const matchingPawn = slotWithMatchingPawn.pawn;
      slotWithMatchingPawn.pawn = null;
      this.fillEmptySlotsWithExtraPawns();
      return matchingPawn;
    }
    return null;
  }
  extractPawnWithState(state) {
    const extraMatchingPawn = this.extraPawns.find((pawn) => pawn.state === state);
    if (extraMatchingPawn) {
      this.extraPawns = this.extraPawns.filter((pawn) => pawn !== extraMatchingPawn);
      return extraMatchingPawn;
    }
    const slotWithMatchingPawn = this.slots.find((slot) => slot.pawn && slot.pawn.state === state);
    if (slotWithMatchingPawn) {
      const matchingPawn = slotWithMatchingPawn.pawn;
      slotWithMatchingPawn.pawn = null;
      this.fillEmptySlotsWithExtraPawns();
      return matchingPawn;
    }
    return null;
  }
  fillEmptySlotsWithExtraPawns() {
    let freeSlot = this.getFreeSlots()[0];
    while (this.extraPawns.length && freeSlot) {
      freeSlot.pawn = this.extraPawns.pop();
      freeSlot.pawn.setPos(freeSlot.getPos());
      freeSlot = this.getFreeSlots()[0];
    }
  }
  getFreeSlots() {
    return this.slots.filter((slot) => !slot.pawn);
  }
  getPosToken() {
    const [ x, y ] = this.getPos();
    return [
      x + 20,
      y + 20,
    ];
  }
  getRandomPos(forProp) { // Return coordinates of a random point on the place
    const [ x, y ] = this.getPos();
    return [
      x + (this.rng.randBetween0And1() * (this.width - forProp.width)),
      y + (this.rng.randBetween0And1() * (this.height - forProp.height)),
    ];
  }
}

// Planète "lieu public" ou "maison"
export class TypedPlanet extends Place {
  constructor({ board, pos, cssClass, slotsPos, type, height, width }) {
    super({ board, pos, cssClass, slotsPos, height, width });
    this.type = type;
    this.elem.classList.add(type);
    const contaminedImg = document.createElement('img');
    contaminedImg.setAttribute('src', '/assets/contamined.png');
    contaminedImg.setAttribute('width', this.width + 30);
    contaminedImg.setAttribute('height', this.height + 30);
    contaminedImg.setAttribute('style', 'margin-top:-15px;margin-left:-15px;');
    contaminedImg.classList.add('no-contamined');
    this.elem.appendChild(contaminedImg);
  }
}
TypedPlanet.TYPES = [ 'crater', 'gaseous', 'artificial' ];

// Planète "lieu public"
export class PublicPlace extends TypedPlanet {
  constructor({ board, pos, slotsPos, type }) {
    super({ board, pos, cssClass: 'public-place', slotsPos, type, height: 180, width: 180 });
  }
}

// Planète "maison"
export class Planet extends TypedPlanet {
  constructor({ board, pos, slotsPos, type }) {
    super({ board, pos, cssClass: 'planet', slotsPos, type, height: 180, width: 180 });
  }
}

// Un pion robot
export class Pawn extends GameProp {
  constructor({ board, state }) {
    super({ board, pos: INITIAL_PAWNS_POS, cssClass: 'pawn', height: 25, width: 25 });
    this.setState(state || 'sane');
  }
  setState(state) {
    if (this.state) {
      // wrapAnimDelay(() => {this.elem.classList.add('flipOutX')).next(wrapAnimDelay(() => {
      this.elem.classList.remove(this.state);
      this.state = state;
      this.elem.classList.add(state);
      // }));
    } else {
      this.state = state;
      this.elem.classList.add(state);
    }
  }
}
Pawn.STATES = [ 'sane', 'incubating', 'sick', 'healed' ];

// Marqueur planète
export class PlanetToken extends GameProp {
  constructor({ board }) {
    super({ board, pos: INITIAL_PAWNS_POS, cssClass: 'planet-token', height: 100, width: 100 });
    this.elem.textContent = '🪐';
  }
}

// Marqueur tour
export class RoundToken extends GameProp {
  constructor({ board }) {
    super({ board, pos: INITIAL_ROUND_POS, cssClass: 'round-token', height: 100, width: 100 });
    this.elem.textContent = '🤖';
  }
}

// Marqueur tour
export class CrisisToken extends GameProp {
  constructor({ board }) {
    super({ board, pos: INITIAL_CRISIS_POS, cssClass: 'crisis-token', height: 100, width: 100 });
    this.elem.textContent = '🚨';
  }
}
