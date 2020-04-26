import { MeasuresOverlay } from './measures.js';
import { RandomGenerator } from './random.js';
import { wrapAnimDelay } from './promise-utils.js';

export class Board {
  constructor(doc, seed) {
    this.doc = doc;
    this.elem = doc.getElementById('board');
    this.rng = new RandomGenerator(seed);
    doc.getElementById('seed').textContent = seed;
    this.goOnCallback = null;
    this.goOnButton = doc.getElementById('go-on');
    this.goOnButton.onclick = () => {
      if (this.goOnCallback) {
        this.goOnCallback();
      }
    };
    this.measuresOverlay = new MeasuresOverlay(doc);
    doc.getElementById('measures-toggle').onclick = () => this.measuresOverlay.toggleDisplay();
    this.planetToken = null;
    this.planetTokenPlanet = null;
    this.allPlanets = [];
    this.allPublicPlaces = [];
    this.planetsPerType = {};
    this.publicPlacesPerType = [];
    this.bonusInfection = 0; // nb d'infectés à enlever dans lors de la contagion (effet carte mesure gestes barrières)
  }
  addPlanet(planet) {
    this.allPlanets.push(planet);
    if (!this.planetsPerType[planet.type]) {
      this.planetsPerType[planet.type] = [];
    }
    this.planetsPerType[planet.type].push(planet);
    return planet;
  }
  addPublicPlace(publicPlace) {
    this.allPublicPlaces.push(publicPlace);
    if (!this.publicPlacesPerType[publicPlace.type]) {
      this.publicPlacesPerType[publicPlace.type] = [];
    }
    this.publicPlacesPerType[publicPlace.type].push(publicPlace);
    return publicPlace;
  }
  planetTokenAcquirePawn(pawn) {
    return wrapAnimDelay( () => this.planetTokenPlanet.acquirePawn(pawn)).then(() => wrapAnimDelay(() => this.movePlanetTokenTo(this.planetTokenPlanet.nextPlanet)));
  }
  movePlanetTokenTo(planet) {
    this.planetTokenPlanet = planet;
    this.planetToken.setPos(planet.getRandomPos(this.planetToken));
  }
  updateCounters() {
    this.doc.getElementById('sane').textContent = this.doc.getElementsByClassName('sane').length;
    this.doc.getElementById('incubating').textContent = this.doc.getElementsByClassName('incubating').length;
    this.doc.getElementById('sick').textContent = this.doc.getElementsByClassName('sick').length;
    this.doc.getElementById('healed').textContent = this.doc.getElementsByClassName('healed').length;
  }
}
