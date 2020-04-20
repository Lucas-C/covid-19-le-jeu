const INITIAL_PAWNS_POS = [ 0, 0 ];
import { wrapAnimDelay } from './promise-utils.js';

// Un élément "physique" du jeu
// Cette classe a la responsabilité de le placer & de l'animer à l'écran
class GameProp {
  constructor({ board, pos, cssClass, height, width }) {
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
  }
  isContaminated() { // s'il y a des pions en extra et au moins un malade dans le lieu, alors le lieu est contaminé
    if (this.extraPawns.length > 0 && this.extractAllPawnsWithState('sick').length > 0) {
      this.elem.classList.add('contamined');
      return true;
    }
    return false;
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
  extractPawns(count) {
    // cf. https://github.com/covid19lejeu/covid-19-le-jeu/blob/master/PRINCIPE_DU_JEU.md#priorit%C3%A9-de-d%C3%A9placement-
    // TODO : implémenter les règles correspondant au 2e déplacement
    const extractedPawns = [];
    for (let i = 0; i < count; i++) {
      if (i === 0) {
        extractedPawns.push(this.extractPawnWithState('incubating') || this.extractPawnWithState('sane') || this.extractPawnWithState('sick') || this.extractPawnWithState('healed'));
      } else {
        extractedPawns.push(this.extractPawnWithState('healed') || this.extractPawnWithState('sane') || this.extractPawnWithState('incubating') || this.extractPawnWithState('sick'));
      }
    }
    return extractedPawns;
  }
  extractAllPawnsWithState(state) {
    const extractedPawns = [];
    let p = this.extractPawnWithState(state);
    while (p !== null) {
      extractedPawns.push(p);
      p = this.extractPawnWithState(state);
    }
    return extractedPawns;
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
    super({ board, pos: INITIAL_PAWNS_POS, cssClass: 'pawn', height: 20, width: 20 });
    this.setState(state || 'sane');
  }
  setState(state) {
    if (this.state) {
      wrapAnimDelay(() => this.elem.classList.add('flipOutX')).then(this.elem.classList.remove(this.state));
    }
    this.state = state;
    this.elem.classList.add(state);
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
