import { EventCard, messageDesc, TypedPlanet } from './game-props.js';
import { chainExec, wrapAnimDelay } from './promise-utils.js';
import { addPawnOnPlanet } from './init.js';

export function initEventsCards(board) {
  board.allEvents.push(new EventCard(board, 'saison-festivals', festivalSeason));
  board.allEvents.push(new EventCard(board, 'contamination-market', contaminMarket));
  board.allEvents.push(new EventCard(board, 'repas-amis', friendsMeet));
  board.allEvents.push(new EventCard(board, 'groupe-voyageurs', travelGroup));
  board.allEvents.push(new EventCard(board, 'contamination-lieux-publics', contaminPublicPlaces));
  board.allEvents.push(new EventCard(board, 'harry-botter', harryBotter));
  board.allEvents.push(new EventCard(board, 'penurie-masque', maskShortage));
  board.allEvents.push(new EventCard(board, 'escroquerie-materiel', fraud));
  board.allEvents.push(new EventCard(board, 'robot-academie', academyEvent));
  board.allEvents.push(new EventCard(board, 'volontaires', volunteers));
  board.allEvents.push(new EventCard(board, 'confiance', trustEvent));
  board.allEvents.push(new EventCard(board, 'desinformation', fakeNews));
}
function fakeNews(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE EVENEMENT jouée : Désinformation');
    board.allPlanets.forEach((planet) => {
      if (planet.isContaminated()) {
        const pawn = planet.extractPawnWithState('sane');
        pawn.setState('incubating');
        planet.acquirePawn(pawn);
      }
    });
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE EVENEMENT désactivée : Désinformation');
    // TO-DO
  }
}
function trustEvent(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE EVENEMENT jouée : Confiance retrouvée');
    board.tmpBonusPoint = 1;
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE EVENEMENT désactivée : Confiance retrouvée');
    // TO-DO
  }
}
function volunteers(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE EVENEMENT jouée : Volontaires');
    const robopitalCampagne = board.getCard('robopital-campagne', 'Measure');
    robopitalCampagne.enable();
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE EVENEMENT désactivée : Volontaires');
    // TO-DO
  }
}
function academyEvent(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE EVENEMENT jouée : Robot Académie');
    addPawnOnPlanet({ board, state: 'incubating', planet: board.robotAcademy });
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE EVENEMENT désactivée : Robot Académie');
    // TO-DO
  }
}
function fraud(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE EVENEMENT jouée : Escroquerie');
    const [ pawn1, pawn2 ] = board.garageColA.extractPawns(2, 2);
    wrapAnimDelay(() => {
      if (pawn1) {
        board.planetTokenAcquirePawn(pawn1);
      }
    }).then(wrapAnimDelay(() => {
      if (pawn2) {
        board.planetTokenAcquirePawn(pawn2);
      }
    }));
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE EVENEMENT désactivée : Escroquerie');
    // TO-DO
  }
}
function maskShortage(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE EVENEMENT jouée : Pénurie de masques');
    // Mesure port de masques désactivée
    const mask = board.getCard('masque-obligatoire', 'Measure');
    if (mask && mask.active) {
      mask.disable(board);
    }
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE EVENEMENT désactivée : Pénurie de masques');
    // TO-DO
  }
}
function harryBotter(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE EVENEMENT jouée : Harry Botter et le Covid-19');
    const publicClosed = board.getCard('fermeture-lieu-public', 'Measure');
    const mask = board.getCard('masque-obligatoire', 'Measure');
    const academyClosed = board.getCard('fermetures-ecoles', 'Measure');
    /*
      Si(mesure fermeture des lieux publics pas active) :
        Si(mesure port du masque active) :
            Ajouter 1 pion dans le cinéma
        Sinon si (mesure fermeture école active) :
            Ajouter 3 pions dans le cinéma
        Sinon Ajouter 2 pions dans le cinéma
    */
    if (publicClosed && publicClosed.active === false) {
      const cinema = board.getPublicPlace('Cinéma');
      if (mask && mask.active === true) {
        addPawnOnPlanet({ board, state: 'incubating', planet: cinema });
      } else if (academyClosed && academyClosed.active) {
        addPawnOnPlanet({ board, state: 'incubating', planet: cinema });
        addPawnOnPlanet({ board, state: 'incubating', planet: cinema });
        addPawnOnPlanet({ board, state: 'incubating', planet: cinema });
      } else {
        addPawnOnPlanet({ board, state: 'incubating', planet: cinema });
        addPawnOnPlanet({ board, state: 'incubating', planet: cinema });
      }
    }
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE EVENEMENT désactivée : Harry Botter et le Covid-19');
    // TO-DO
  }
}
function contaminPublicPlaces(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE EVENEMENT jouée : Les lieux publics sont sources de contamination');
    const mask = board.getCard('masque-obligatoire', 'Measure');
    const preventionN2 = board.getCard('gestes-barrieres-N2', 'Measure');
    if ((mask && mask.active === false) || (preventionN2 && preventionN2.active === false)) {
      board.allPublicPlaces.forEach((planet) => {
        const pawns = planet.getAllPawnsWithState('sane');
        if (pawns.length > 0) {
          pawns[0].setState('incubating');
        }
      });
    } else {
      let nb = 0;
      board.allPublicPlaces.forEach((planet) => {
        const pawns = planet.getAllPawnsWithState('sane');
        if (pawns.length > 0 && nb < 2) {
          pawns[0].setState('incubating');
          nb++;
        }
      });
    }
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE EVENEMENT désactivée : Les lieux publics sont sources de contamination');
    // TO-DO
  }
}
function travelGroup(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE EVENEMENT jouée : Un groupe de voyageurs revient d’une zone à risque');
    const depistage = board.getCard('depistages-frontieres', 'Measure');
    if (depistage && depistage.active === false) {
      const dice = board.rng.rollDie();
      const states = [];
      for (let i = 0; i < dice; i++) {
        states.push('sane');
      }
      for (let i = 0; i < 6 - dice; i++) {
        states.push('incubating');
      }
      addPawnOnPlanet({ board, state: states.pop(), planet: board.planetTokenPlanet })
        .then(() => wrapAnimDelay(() => board.movePlanetTokenTo(board.planetTokenPlanet.nextPlanet)))
        .then(() => addPawnOnPlanet({ board, state: states.pop(), planet: board.planetTokenPlanet }))
        .then(() => wrapAnimDelay(() => board.movePlanetTokenTo(board.planetTokenPlanet.nextPlanet)))
        .then(() => addPawnOnPlanet({ board, state: states.pop(), planet: board.planetTokenPlanet }))
        .then(() => wrapAnimDelay(() => board.movePlanetTokenTo(board.planetTokenPlanet.nextPlanet)))
        .then(() => addPawnOnPlanet({ board, state: states.pop(), planet: board.planetTokenPlanet }))
        .then(() => wrapAnimDelay(() => board.movePlanetTokenTo(board.planetTokenPlanet.nextPlanet)))
        .then(() => addPawnOnPlanet({ board, state: states.pop(), planet: board.planetTokenPlanet }))
        .then(() => wrapAnimDelay(() => board.movePlanetTokenTo(board.planetTokenPlanet.nextPlanet)))
        .then(() => addPawnOnPlanet({ board, state: states.pop(), planet: board.planetTokenPlanet }))
        .then(() => wrapAnimDelay(() => board.movePlanetTokenTo(board.planetTokenPlanet.nextPlanet)));
    }
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE EVENEMENT désactivée : Un groupe de voyageurs revient d’une zone à risque');
    // TO-DO
  }
}
function friendsMeet(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE EVENEMENT jouée : Repas entre amis');
    /*
    Pour chaque lieu maison :
      Si (nombre de pions incubés > 0) :
          Pour la maison suivante :
              Si (nombre de pions sains > 0) :
                  1 pion sain devient incubé
      Si(mesure confinement active) :
          break()
    */
    const confinement = board.getCard('confinement', 'Measure');
    let nb = 0;
    board.allPlanets.forEach((planet) => {
      if (planet.getAllPawnsWithState('incubating').length > 0) {
        const pawns = planet.nextPlanet.getAllPawnsWithState('sane');
        if (pawns && pawns.length > 0) {
          if (confinement && confinement.active === false) {
            pawns[0].setState('incubating');
            nb++;
          } else if (confinement && confinement.active === true && nb < 1) {
            pawns[0].setState('incubating');
            nb++;
          }
        }
      }
    });
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE EVENEMENT désactivée : Repas entre amis');
    // TO-DO
  }
}
function contaminMarket(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE EVENEMENT jouée : Le batterie market est vecteur de contamination');
    const marketClosed = board.getCard('fermeture-batterie-market', 'Measure');
    if (marketClosed && marketClosed.active === false) {
      const pawnsZ1 = board.batterieMarketZ1.getAllPawnsWithState('sane');
      if (pawnsZ1 && pawnsZ1.length > 0) {
        pawnsZ1[0].setState('incubating');
      }
      const pawnsZ2 = board.batterieMarketZ2.getAllPawnsWithState('sane');
      if (pawnsZ2 && pawnsZ2.length > 0) {
        pawnsZ2[0].setState('incubating');
      }
    }
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE EVENEMENT désactivée : Le batterie market est vecteur de contamination');
    // TO-DO
  }
}
function festivalSeason(board, activation = true) {
  if (activation) {
    messageDesc(board, 'CARTE EVENEMENT jouée : Saison des festivals');
    const confinement = board.getCard('confinement', 'Measure');
    if (confinement && confinement.active === false) {
      chainExec(TypedPlanet.TYPES.map((planetType) =>
      // Puis on place un pion "incubé" par planète de chaque type
        () => addPawnOnPlanet({ board, state: 'incubating', planet: board.rng.pickOne(board.planetsPerType[planetType]) }),
      ));
    }
  } else { // gestion de la désactivation d'une carte : il doit y avoir des effets de bords
    messageDesc(board, 'CARTE EVENEMENT désactivée : Saison des festivals');
    // TO-DO
  }
}
