import { RandomGenerator } from './random.js';
import { wrapAnimDelay } from './promise-utils.js';
import { messageDesc, endSplash, EndOverlay, MeasuresOverlay, EventsOverlay } from './game-props.js';

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
        this.buttonDisable();
        this.goOnCallback();
      }
    };
    this.intro = true;
    this.crisisLevel = 0;
    this.measuresOverlay = new MeasuresOverlay(doc);
    doc.getElementById('measures-toggle').onclick = () => this.measuresOverlay.toggleDisplay();
    // doc.getElementById('measures-overlay').onclick = () => this.measuresOverlay.toggleDisplay(); // temporaire
    this.eventsOverlay = new EventsOverlay(doc);
    doc.getElementById('events-toggle').onclick = () => this.eventsOverlay.toggleDisplay();
    doc.getElementById('events-overlay').onclick = () => this.eventsOverlay.toggleDisplay(); // temporaire
    this.endOverlay = new EndOverlay(doc);
    this.planetToken = null;
    this.planetTokenPlanet = null;
    this.allPlanets = [];
    this.allPublicPlaces = [];
    this.planetsPerType = {};
    this.publicPlacesPerType = [];
    this.bonusInfection = 0; // nb d'infectés à enlever dans lors de la contagion (effet carte mesure gestes barrières)
    this.allMeasures = []; // mesures
    this.allEvents = []; // evenements
    this.desactivatedPlanets = []; // carte fermeture transports en commun
    this.levelRobopital = 4; // si dé > levelRobital, alors pion va au robopital
    this.levelHealing = 1; // si dé <= levelHealing, alors le pion est guéri
    this.frontieres = true; // true = pas de dépistage aux frontiere
    this.tmpBonusPoint = 0; // point de mesures bonus
  }
  getCard(id, type = 'Measure') {
    switch (type) {
      case 'Measure':
        return this.allMeasures.find((element) => element.id === id);
      case 'Event':
        return this.allEvents.find((element) => element.id === id);
      default:
        return null;
    }
  }
  getPublicPlace(name) {
    return this.allPublicPlaces.find((element) => element.name === name);
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
  getAllPlanetsWithPublicPlace(place) {
    const planets = [];
    this.allPlanets.forEach((planet) => { // pour chaque planète
      if (planet.publicPlanet === place) {
        planets.push(planet);
      }
    });
    return planets;
  }
  planetTokenAcquirePawn(pawn) {
    return wrapAnimDelay(() => this.planetTokenPlanet.acquirePawn(pawn)).then(() => wrapAnimDelay(() => this.movePlanetTokenTo(this.planetTokenPlanet.nextPlanet)));
  }
  movePlanetTokenTo(planet) {
    this.planetTokenPlanet = planet;
    this.planetToken.setPos(planet.getPosToken());
  }
  updatePlanets() {
    this.allPlanets.forEach((planet) => { // pour chaque planète
      planet.isContaminated(); // mise à jour du statut de contamination
    });
    this.allPublicPlaces.forEach((planet) => { // pour chaque lieu public
      planet.isContaminated(); // mise à jour du statut de contamination
    });
    this.robotAcademy.isContaminated();
    this.batterieMarketZ1.isContaminated();
    this.batterieMarketZ2.isContaminated();
  }
  updateCounters() {
    this.doc.getElementById('sane').textContent = this.doc.getElementsByClassName('sane').length;
    this.doc.getElementById('incubating').textContent = this.doc.getElementsByClassName('incubating').length;
    this.doc.getElementById('sick').textContent = this.doc.getElementsByClassName('sick').length;
    this.doc.getElementById('healed').textContent = this.doc.getElementsByClassName('healed').length;
  }
  setCrisis(level) {
    let diff = this.crisisLevel;
    this.crisisLevel = Math.max(level, this.crisisLevel); // le niveau de crise ne peut pas redescendre
    messageDesc(this, 'Le niveau de crise est à ', this.crisisLevel);
    diff = this.crisisLevel - diff;
    // décalage du curseur crise
    console.debug('Décalage du curseur crise de : ', diff);
    const doc = this.doc;
    const crisisToken = doc.getElementsByClassName('crisis-token');
    for (let i = 0; i < diff; i++) {
      const currentTop = parseInt(crisisToken[0].style.top, 10);
      crisisToken[0].style.top = `${ currentTop + 24 }px`;
    }
  }
  updateCrisisToken() {
    /*
      Si (nombre de lieux avec au moins un malade > 10)
        echelle crise = max(2, echelle crise)
      Sinon si (nombre de lieux avec au moins un malade > 5)
        echelle crise = max(1, echelle crise)
      Sinon echelle crise = max(0, echelle crise)
    */
    let nbPlace = 0;
    this.allPlanets.forEach((planet) => { // pour chaque planète
      if (planet.getAllPawnsWithState('sick').length > 0) {
        nbPlace++;
      }
    });
    this.allPublicPlaces.forEach((planet) => { // pour chaque lieu public
      if (planet.getAllPawnsWithState('sick').length > 0) {
        nbPlace++;
      }
    });
    if (this.robotAcademy.getAllPawnsWithState('sick').length > 0) {
      nbPlace++;
    }
    if (this.batterieMarketZ1.getAllPawnsWithState('sick').length > 0) {
      nbPlace++;
    }
    if (this.batterieMarketZ2.getAllPawnsWithState('sick').length > 0) {
      nbPlace++;
    }
    console.debug(`${ nbPlace } lieu(x) avec au moins 1 malade`);
    messageDesc(this, `${ nbPlace } lieu(x) avec au moins 1 malade`);
    if (nbPlace > 10) {
      this.setCrisis(2);
    } else if (nbPlace > 4) {
      this.setCrisis(1);
    } else {
      this.setCrisis(0);
    }
  }
  buttonEnable() {
    this.goOnButton.disabled = false;
    this.goOnButton.classList.remove('disabled');
  }
  buttonDisable() {
    this.goOnButton.disabled = true;
    this.goOnButton.classList.add('disabled');
  }
  printState() {
    console.log('********** ROBOPITAL **********');
    console.log('Colonne A > Nb pions : ', this.garageColA.getNumberPawns());
    console.log('Colonne B > Nb pions : ', this.garageColB.getNumberPawns());
    console.log('Colonne C > Nb pions : ', this.garageColC.getNumberPawns());
    console.log('*******************************');
  }
  evalWinning() {
    messageDesc(this, 'Avez-vous gagné, perdu ou pouvez-vous continuer ?');
    /*
      Pour chaque lieu hors hôpital :
      Nombre total de malades += Nombre de malades du lieu
      Nombre total de guéris += Nombre de guéris du lieu
      Si(Nombre total de malades = 0) :
          YOU WIN !
      Si(Nombre total de guéris >= 40) :
          YOU WIN !
      Pour l'hôpital :
      Si(Nombre de malades > capacité totale ) :
          YOU LOSE !
      Si(Numero du tour > 10) :
          YOU LOSE !
    */
    let nbSick = 0;
    let nbHealed = 0;
    this.allPlanets.forEach((planet) => {
      nbSick += planet.getAllPawnsWithState('sick').length;
      nbHealed += planet.getAllPawnsWithState('healed').length;
    });
    this.allPublicPlaces.forEach((element) => {
      nbSick += element.getAllPawnsWithState('sick').length;
      nbHealed += element.getAllPawnsWithState('healed').length;
    });
    nbSick += this.robotAcademy.getAllPawnsWithState('sick').length;
    nbHealed += this.robotAcademy.getAllPawnsWithState('healed').length;
    nbSick += this.batterieMarketZ1.getAllPawnsWithState('sick').length;
    nbHealed += this.batterieMarketZ1.getAllPawnsWithState('healed').length;
    nbSick += this.batterieMarketZ2.getAllPawnsWithState('sick').length;
    nbHealed += this.batterieMarketZ2.getAllPawnsWithState('healed').length;
    messageDesc(this, 'Nb de pions malades (hors Robopital) : ', nbSick);
    if (nbSick === 0 && this.garageColA.extraPawns.length === 0) {
      this.buttonDisable();
      messageDesc(this, 'PARTIE FINIE : Vous avez gagné !');
      endSplash(this, 'Bravo vous avez gagné !', 'Vous n\'avez plus de robots malades hors de l\'hôpital.<br/>Sentez-vous libre de rejouer pour voir si ce n\'était pas de la chance ;-)');
      this.endOverlay.toggleDisplay();
    }
    messageDesc(this, 'Nb de pions guéris : ', nbHealed);
    if (nbHealed > 39 && this.garageColA.extraPawns.length === 0) {
      this.buttonDisable();
      messageDesc(this, 'PARTIE FINIE : Vous avez gagné !');
      endSplash(this, 'Bravo vous avez gagné !', 'Vous avez 40 robots guéris. L\'épidémie ne se propage plus.<br/>Sentez-vous libre de rejouer pour voir si ce n\'était pas de la chance ;-)');
      this.endOverlay.toggleDisplay();
    }
    if (this.garageColA.extraPawns.length > 0) {
      this.buttonDisable();
      messageDesc(this, `Robopital surchargé de ${ this.garageColA.extraPawns.length } robots ... `);
      messageDesc(this, 'PARTIE FINIE : Vous avez perdu !');
      endSplash(this, 'Dommage, vous avez perdu ...', `Votre Robopital a été surchargé de ${ this.garageColA.extraPawns.length } robots ...<br/>Sentez-vous libre de rejouer ;-)`);
      this.endOverlay.toggleDisplay();
    }
  }
}
