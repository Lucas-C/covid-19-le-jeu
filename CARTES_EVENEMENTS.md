# Explication des cartes événements

## Le batterie market est vecteur de contamination

_1 pion devient incubé dans chaque zone occupée du supermarché._
_Les effets de cette carte sont annulés si vous avez pris la mesure « [fermeture des supermarchés](CARTES_MESURES.md#fermetureMarket) »_

    Si (mesure fermeture batteries market pas active) :
        Pour chaque zone du batteries market :
            Si(nombre de pions sains > 0) :
                1 pion sain devient incubé

## Repas entre amis :)

_Pour chaque maison comptant 1 incubé (ou plus), 1 pion devient incubé dans la maison adjacente (dans le sens horaire)_
_Les effets de cette carte sont limités à une contamination (soit 1 seul pion incubé) pour tout le plateau si vous avez pris la mesure « confinement »_

    Pour chaque lieu maison :
        Si (nombre de pions incubés > 0) :
            Pour la maison suivante :
                Si (nombre de pions sains > 0) :
                    1 pion sain devient incubé
        Si(mesure confinement active) :
            break()

## C’est la saison des festivals !

_Ajouter 3 pions incubés dans 3 maisons prise au hasard (lancer 3 dés)._
_Les effets de cette carte sont annulés si vous avez pris la mesure « confinement »_

    Si(mesure confinement pas active) :
        Tirer au hasard 3 nombres différents entre 1 et 16 pour désigner les maisons
        Pour chaque maison :
            Ajouter 1 pion incubé

## Les lieux publics sont sources de contamination

_Pour chaque lieu public contenant des pions, remplacer un pion sain par un pion incubé._
_Si vous avez pris la mesure « port obligatoire du masque » ou « gestes barrière V2 », deux lieux maximum sont concernés._

    Si(mesure port obligatoire du masque pas active && mesure gestes barrière V2  pas active) :
        Pour chaque lieu public :
            Si (nombre de pions sains > 0) :
                    1 pion sain devient incubé

## Un groupe de voyageurs revient d’une zone à risque

_Ajouter 6 pions dans 6 maisons prise au hasard (lancer 3 dés). Lancer un dé pour savoir combien de pions seront incubés sur les 6_
_Les effets de cette carte sont annulés si vous avez pris la mesure « dépistage systématique aux frontières »_

    Si(mesure dépistage systématique aux frontières pas active) :
        Tirer au hasard 6 nombres différents entre 1 et 16  pour désigner les maisons
        Tirer au hasard le nombre de pions incubés entre 1 et 6 (dé)
        Compteur i = 0
        Pour chaque maison :
            Si(i < dé) :
                Ajouter 1 pion incubé
            Sinon ajouter 1 pion sain
            i++
        
## « Harry potter & le COVID19 » sort au cinéma : les spectateurs se précipitent dans les salles obscures !

_Ajouter 2 pions incubés dans le cinéma. Les effets de cette carte sont annulés si vous avez pris la mesure « fermeture des lieux publics ». Ajouter 1 seul pion si vous avez pris « port du masque obligatoire » et ajouter 3 pions si vous avez fermées écoles sans prendre les autres_

    Si(mesure fermeture des lieux publics pas active) :
        Si(mesure port du masque active) :
            Ajouter 1 pion dans le cinéma
        Sinon si (mesure fermeture école active) :
            Ajouter 3 pions dans le cinéma
        Sinon Ajouter 2 pions dans le cinéma
