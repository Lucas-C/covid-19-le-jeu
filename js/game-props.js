const INITIAL_PAWNS_POS = [ 0, 0 ];

import { RandomGenerator } from './random.js';

export class Board {
  constructor(doc, seed) {
    this.doc = doc;
    this.elem = doc.getElementById('board');
    doc.getElementById('seed').textContent = seed;
    this.rng = new RandomGenerator(seed);
    this.goOnCallback = null;
    this.allPlanets = [];
    this.planetsPerType = {};
  }
  addPlanet(planet) {
    this.allPlanets.push(planet);
    if (!this.planetsPerType[planet.type]) {
      this.planetsPerType[planet.type] = [];
    }
    this.planetsPerType[planet.type].push(planet);
  }
}

// Un élément "physique" du jeu
// Cette classe a la responsabilité de le placer & de l'animer à l'écran
class GameProp {
  constructor({ board, pos, cssClass }) {
    this.elem = board.doc.createElement('div');
    // Tous les élements sont enfants d'un même parent pour pouvoir animer leurs changements positions left/top :
    board.elem.appendChild(this.elem);
    this.elem.style.position = 'absolute';
    this.elem.classList.add('game-prop');
    this.elem.classList.add(cssClass);
    this.setPos(pos);
  }
  setPos(pos) {
    this.elem.style.left = `${ pos[0] }px`;
    this.elem.style.top = `${ pos[1] }px`;
  }
  getPos() {
    return [ this.elem.style.left.slice(0, -2), this.elem.style.top.slice(0, -2) ];
  }
}

// Un emplacement de pion dans un lieu
class PlaceSlot extends GameProp {}

// Un lieu pouvant héberger des pions
class Place extends GameProp {
  constructor({ board, pos, cssClass, slotsPos }) { // slotsPos correspond aux coordonnés des emplacements de pion sur le bâtiment
    super({ board, pos, cssClass });
    this.slots = slotsPos.map((slotPos) => new PlaceSlot({ board, pos: slotPos, cssClass: 'slot' }));
  }
  putIn(pawn) {
    const freeSlots = this.getFreeSlots();
    if (!freeSlots.length) {
      throw new Error('Not implemented yet!');
    }
    pawn.setPos(freeSlots[0].getPos());
  }
  getFreeSlots() {
    return this.slots.filter((slot) => !slot.elem.children.length);
  }
}

// Planète "lieu public"
export class TypedPlanet extends Place {
  constructor({ board, pos, cssClass, slotsPos, type }) {
    super({ board, pos, cssClass, slotsPos });
    this.type = type;
  }
}
TypedPlanet.TYPES = [ 'crater', 'gaseous', 'ring' ];

export class Planet extends TypedPlanet {
  constructor({ board, pos, slotsPos, type }) {
    super({ board, pos, cssClass: 'planet', slotsPos, type });
  }
}

// Un pion
export class Pawn extends GameProp {
  constructor({ board, state }) {
    super({ board, pos: INITIAL_PAWNS_POS, cssClass: 'pawn' });
    this.setState(state || 'SANE');
  }
  setState(state) {
    this.state = state;
    if (state === 'HEALED') {
      this.elem.style.backgroundImage = 'none';
    } else {
      this.elem.style.backgroundImage = `url(assets/pawn-${ state.toLowerCase() }.png)`;
    }
  }
}
Pawn.STATES = [ 'SANE', 'INCUBATING', 'SICK', 'HEALED' ];

// Marqueur planète
export class PlanetToken extends GameProp {
  constructor({ board }) {
    super({ board, pos: INITIAL_PAWNS_POS, cssClass: 'planet-token' });
    this.elem.textContent = '🪐';
  }
}
