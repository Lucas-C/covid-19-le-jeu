# Explication des cartes mesures

## Gestes barrière V1 : Diffusion des gestes de prévention dans les médias <a id="barriereV1"></a>

_Vous devez avoir pris cette mesure avant de pouvoir poser la mesure « gestes barrières V2 »_

    Enregistrer l'utilisation de la carte
    // Aucun effet

## Adopter les bonnes pratiques pendant les courses <a id="bonnespratiques"></a>

_La zone 2 du supermarché est condamnée. Les pions ne restent plus q’un seul tour au supermarché et rentrent ensuite dans les maisons_

    Enregistrer l'utilisation de la carte
    Nouvelle règle :
        Désactiver la zone 2 du batteries market // les pions vont dans les maisons en sortie de zone 1

## Gestes barrière V2 : diffusion massive des gestes de prévention dans tous les médias et tous les lieux publics <a id="barriereV2"></a>

_-1 contamination (dans les lieux publics, l’école et le supermarché)_

    Enregistrer l'utilisation de la carte
    Si(Gestes barrière V1 active) :
        Nouvelle règle :
            Contamination Lieux Publics | batteries market | robot académie :
                Pour chaque lieu :
                    Si le lieu est à risque :
                        Si lieu est robot académie :
                            Pour chaque malade :
                                4 pions sains deviennent incubés
                            1 pion incubé devient sain
                        sinon :
                            Pour chaque malade :
                                2 pions sains deviennent incubés
                            Si lieu n'est pas une maison :
                                1 pion incubé devient sain
            

## Limitation des déplacements (dé 2) <a id="limitation2"></a>

_Les déplacements 2 depuis les maisons sont toujours possible mais une seule personne à la fois._

    Enregistrer l'utilisation de la carte
    Nouvelle règle :
        Déplacement des pions :
            Pour chaque maison cratère :
                si (dé = 2) déplacer 1 robot dans la maison suivante

            Pour chaque lieu public :
                si (dé = 2) déplacer 1 robot dans deux maisons du quartier

## Limitation des déplacements (dé 3) <a id="limitation3"></a>

_Les déplacements 3 depuis les maisons sont toujours possible mais une seule personne à la fois._

    Enregistrer l'utilisation de la carte
    Nouvelle règle :
        Déplacement des pions :
            Pour chaque maison cratère :
                si (dé = 3) déplacer 1 robot dans la maison suivante

            Pour chaque lieu public :
                si (dé = 3) déplacer 1 robot dans deux maisons du quartier

## Interdiction de venir aux urgences <a id="urgences"></a>

_Pour chaque pion malade dans une maison, si le dé de résolution donnent 6, le pion malade est envoyé à l'hôpital, sinon il reste dans la maison._ (au lieu de 5 et 6)

    Enregistrer l'utilisation de la carte
    Nouvelle règle :
        Pour chaque lieu hors hopital :
            Pour chaque pion malade :
                Si(dé > 5) déplacer le pion à l'hôpital


## Dépistage systématique aux frontières <a id="depistage"></a>

_Lors de la phase de déplacement, en cas de 6, seul 1 pion sain est ajouté sur le plateau_

    Enregistrer l'utilisation de la carte
    Nouvelle règle :
        Déplacement pions maisons :
            si (dé = 6) :
                    ajouter 1 robot sain dans la maison qui a le marqueur planète
                    avancer le marqueur planète


## Déploiement d’un hôpital militaire <a id="militaire"></a>

_La dernière ligne de l’hôpital (cases grises) peut maintenant accueillir des malades_

    Enregistrer l'utilisation de la carte
    Nouvelle règle :
        Pour chaque colonne de l'hôpital :
            Capacité += 1 


## Sensibilisation aux gestes barrière dans les écoles <a id="barriereEcole"></a>

_En cas de contaminaCon à l’école, pour chaque malade présent, remplacez 2 pions sains par 2 pions incubés au lieux de 4_

    Enregistrer l'utilisation de la carte
    Nouvelle règle :
        Pour chaque lieu :
            Si le lieu est à risque :
                Si lieu est robot académie :
                    Pour chaque malade :
                        2 pions sains deviennent incubés

## Port obligatoire du masque pour tout le monde <a id="masque"></a>

_Une seule contamination par malade au lieu de 2_

    Enregistrer l'utilisation de la carte
    Nouvelle règle :
        Pour chaque lieu :
            Si le lieu est à risque :
                Si lieu est robot académie :
                    Pour chaque malade :
                        4 pions sains deviennent incubés
                sinon :
                    Pour chaque malade :
                        1 pion sain devient incubés


## Fermeture des écoles <a id="fermetureEcole"></a>

_Tous les 1 sont ignorés. Les pions présents dans l’école retournent dans les maisons._

    Enregistrer l'utilisation de la carte
    Nouvelle règle :
        Pour chaque maison | lieux publics :
            si (dé = 1) déplacer 0 robot


## Confinement <a id="confinement"></a>

- _Les déplacements 2 et 3 depuis les maisons sont interdits._
- _Un robot par maison vont au batterie market_ (à confirmer)

    Enregistrer l'utilisation de la carte
    Nouvelle règle :
        Pour chaque maison | lieux publics :
            si (dé = 2) déplacer 0 robot
            si (dé = 3) déplacer 0 robot
    Pour chaque lieu maison :
        Déplacer un pion au batteries market

## Fermeture des lieux publics <a id="fermetureLieuxPublics"></a>

- _Les déplacements 4 depuis les maisons sont maintenant impossibles - les déplacements entre les lieux publics sont impossibles_
- _Pour toute maison avec 4 pions ou plus, un robot va dans le lieu public de son quartier_ (à confirmer)

    Enregistrer l'utilisation de la carte
    Nouvelle règle :
        Pour chaque maison :
            si (dé == 4) déplacer 0 robot
        Pour chaque lieu public :
            si(dé == 2|3|4|5) déplacer 1 pion dans chaque maison du quartier
    Pour chaque lieu maison :
        si(nombre de pions > 3) :
            déplacer un pion dans le lieu public de son quartier

## Fermeture du batteries market <a id="fermetureMarket"></a>

_Les déplacements 5 depuis les maisons sont maintenant impossibles_

    Enregistrer l'utilisation de la carte
    Nouvelle règle :
        Pour chaque maison | lieux publics :
            si (dé = 5) déplacer 0 robot

## Fermeture des transports en commun <a id="fermetureTransports"></a>

- _Désigner 3 maisons (avec les dés). Jusqu’à la fin du jeu, les déplacements de ces 3 maisons sont annulés (des pions extérieurs peuvent y venir)_
- _Si l’école n’est pas fermée, seul 1 pions par maison va à l’école_

    Enregistrer l'utilisation de la carte
    Tirer au hasard 3 nombres différents entre 1 et 16
    Nouvelle règle :
        Désactiver les déplacements 2, 3 et 4 depuis ces 3 maisons
        Pour chacune de ces maisons :
            si (dé = 1) déplacer 1 robot


## Découverte du traitement <a id="traitement"></a>

_A chaque tour, lors de la phase 5/les maladies se déclarent, si le dé indique 1, 2 ou 3, le pion est guéri._

    Enregistrer l'utilisation de la carte
    Nouvelle règle : 
        Pour chaque lieu hors hopital :
            Pour chaque pion malade :
                Tirer au hasard un chiffre de 1 à 6 (dé)
                Si(dé > 4) déplacer le pion à l'hôpital
                Si(dé < 4) le pion devient guéri