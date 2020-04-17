# Principe du jeu

## Introduction

Ce jeu est un jeu coopératif, c'est à dire que tou.te.s les joueur.euse.s jouent ensemble contre le jeu.

Ce fichier décrit étape par étape le jeu en traduisant en logique les règles du jeu de plateau.

Chaque étape sera écrite de la façon suivante :

_texte présent dans les règles_

    traduction logique de tout cela

## Storytelling

_Vous êtes « Droïde en chef » d’un tranquille petit système planétaire au large de la constellation de Zydia. Quelques robots de votre circonscription ont été contaminés par un virus et, en tant que chef, vous devez gérer la situation pour assurer la sécurité des robots de votre système. Pour cela, vous prendrez des mesures et serez particulièrement vigilant au bon fonctionnement de votre système de réparation._

## Principes généraux

Le plateau comptent :

- 16 planètes "maisons" en périphérie du plateau de 3 types différents
- 4 planètes "lieux publics" (bar, restaurant, cinéma, médiathèque)
- 1 école
- 1 batterie market "supermarché"
- 1 hôpital

Le joueur dispose de 4 types de pions :

- pion sain
- pion incubé
- pion malade
- pion guéri

### Lieu à risque <a id="lieuarisque"></a>

_Tous les lieux, sauf l’hôpital, peuvent contenir autant de pions robots que nécéssaire au déroulement du jeu. Le nombre de cases dans chaque lieu indique la capacité normale du lieu, il peut donc en contenir plus. Si un lieu contient plus de pions que son nombre de cases, la proximité entre les pions sera propice à la contagion…_

    Si(Type de lieu != hôpital)
        Nombre de pions maximum dans un lieu = infini
        Si(Nombre de pions malades > 0 && Nombre de pions > capacité)
            Lieu est à risque

### Priorité de déplacement <a id="prioritedeplacement"></a>

_Premier déplacement : Dans la mesure du possible, le premier pion déplacé doit être sain et le deuxième incubé. Si ce n’est pas possible, choisissez les pions qui se déplacent ^^_

    Pour i=0; i < nombre de pion à déplacer ; i++ :
        si (i==1) déplacer un pion incubé|sain|malade|guéri
        sinon déplacer un pion guéri|sain|incubé|malade

_Deuxième déplacement : Tout le monde rentre chez soi : La distribution des robots se réalise toujours en commençant par les robots malades, puis incubés, puis sains puis guéris._

    Pour chaque pion à distribuer :
        Pour chaque pion malade :
            ajouter le pion dans la maison qui a le marqueur planète
            avancer le marqueur planète
        Pour chaque pion incubé :
            ajouter le pion dans la maison qui a le marqueur planète
            avancer le marqueur planète
        Pour chaque pion sain :
            ajouter le pion dans la maison qui a le marqueur planète
            avancer le marqueur planète
        Pour chaque pion guéri :
            ajouter le pion dans la maison qui a le marqueur planète
            avancer le marqueur planète

### Fin de la partie <a id="findepartie"></a>

_La partie prend fin immédiatement :_

- _SOIT quand tous les pions malades sont à l’hôpital et qu’il ne reste plus sur le plateau que des pions sains ou guéris. Vous avez gagné !_
- _SOIT quand au moins 40 pions guéris sont sur le plateau. Vous avez gagné !_
- _SOIT quand un pion malade ne peut être admis à l’hôpital faute de place disponible (étape 5). Dans ce cas vous avez perdu…_
- _SOIT quand vous dépassez le 10ème tour. Dans ce cas vous avez perdu…_

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

## Etape 0 : mise en place

_Demandez à un enfant de désigner 1 maison de chaque type (cratère, gaz, anneau) et placer 1 pion incubé supplémentaire dans chacune d’elle (ne pas remplacer mais ajouter 1 pion à ceux de la maison)._

    Pour chaque type de maison :
        Tirer une maison au hasard
        Ajouter 1 pion incubé

_Placez un marqueur (légo, playmobil, capsule de bière, pâte, capuchon de stylo, …) a coté d’une maison au hasard. Nous appellerons ce marqueur le marqueur planète._

    Tirer une maison au hasard
    Marqueur planète = id de cette maison

_Placez l’aide de jeu sur la table et positionnez 2 marqueurs (légos, playmobils, pâtes, capuchons de stylo, ...) sur les échelles de crise et de tour_

    Echelle crise = 0
    Echelle tour = 1

cf. [mode de calcul en étape 5](#curseurcrise)

## Etape 1 : début du tour

Cartes mesures affectant le comportement :
- [Limitation déplacement 2](CARTES_MESURES.md#limitation2) : 1 seul robot est déplacé par maison si dé 2
- [Limitation déplacement 3](CARTES_MESURES.md#limitation3) : 1 seul robot est déplacé par maison si dé 3
- [Dépistage aux frontières](CARTES_MESURES.md#depistage) : le dé 6 ne fait rentré qu'un pion sain
- [Dépistage aux frontières](CARTES_MESURES.md#fermetureEcole) : le dé 1 n'a plus d'effet
- [Confinement](CARTES_MESURES.md#confinement) : les dés 2 et 3 n'ont plus d'effet
- [Fermeture lieux publics](CARTES_MESURES.md#fermetureLieuxPublics) : le dé 4 n'a plus d'effet
- [Fermeture batteries market](CARTES_MESURES.md#fermetureMarket) : le dé 5 n'a plus d'effet
- [Fermeture des transports en commun](CARTES_MESURES.md#fermetureTransports) : les dés 2 et 3 n'ont plus d'effet pour 3 maisons choisies et le dé 1 ne déplace qu'un seul robot

_Vous allez déplacer, dans l’ordre, les pions présents dans toutes les maisons et tous les lieux publics de type cratère, puis gazeux, puis anneau._

    Ordre des types de lieux = [cratère, gazeux, anneau]

_A chaque fois vous appliquerez la méthode suivante : lancez un dé et, en fonction du résultat, appliquez, pour le type de planète concerné, les déplacements_

    Pour chaque type de lieux
        Tirer au hasard un chiffre de 1 à 6 (dé)
        si (dé = 6) :
                ajouter 1 robot incubé dans la maison qui a le marqueur planète
                avancer le marqueur planète
                ajouter 1 robot sain dans la maison qui a le marqueur planète
                avancer le marqueur planète
                ajouter 1 robot sain dans la maison qui a le marqueur planète
                avancer le marqueur planète
        sinon :
            Pour chaque maison du type de planète concerné :
                si (dé = 1) déplacer 2 robots à la robot académie
                si (dé = 2) déplacer 2 robots dans la maison suivante
                si (dé = 3) déplacer 2 robots dans la maison précédente
                si (dé = 4) déplacer 2 robots dans le lieu public du quartier
                si (dé = 5) déplacer 2 robots dans la zone 1 du batterie market

            Pour chaque lieu public :
                si (dé = 1) déplacer 2 robots à l'école
                si (dé = 2) déplacer 1 robot dans chaque maison du quartier
                si (dé = 3) déplacer 1 robot dans chaque maison du quartier
                si (dé = 4) déplacer 2 robots dans le lieu public suivant
                si (dé = 5) déplacer 2 robots dans le lieu public précédént

voir règle de [priorité de déplacement](#prioritedeplacement)

## Etape 2 : développement de la maladie

### Phase 1 : déclaration des symptômes

_Commencez par remplacer tous les robots incubés présents sur le plateau par des robots malades_

    Pour chaque lieu :
        Nombre de pions malades += Nombre de pions incubés
        Nombre de pions incubés = 0

ou

    Pour chaque lieu :
        Pour chaque pion incubé :
            le pion devient malade

### Phase 2 : contagion

Cartes mesures affectant le comportement :
- [Gestes barrière V2](CARTES_MESURES.md#barriereV2) : -1 malade
- [Gestes barrière école](CARTES_MESURES.md#barriereEcole) : seulement 2 pions par malade dans la robot académie
- [Port du masque](CARTES_MESURES.md#masque) : seulement 1 pion contaminé par malade

_Pour chaque lieu à risque (hors robot académie) et pour chaque malade présent sur le lieu : remplacer 2 robots sains par 2 robots incubés. Si la robot académie est à risque, pour chaque malade présent : remplacer 4 robots sains par 4 robots incubés._

    Pour chaque lieu :
        Si le lieu est à risque :
            Si lieu est robot académie :
                Pour chaque malade :
                    4 pions sains deviennent incubés
            sinon :
                Pour chaque malade :
                    2 pions sains deviennent incubés

voir règle de [lieu à risque](#lieuarisque)

## Etape 3 : deuxième déplacement des robots

### Robot académie

_Enlevez tous les robots de la robot académie pour les replacer dans les maisons. Commencez par la maison indiquée par le marqueur de retours puis distribuez 1 robot par maison dans le sens horaire. A la fin de la distribution, déplacez le marqueur de retours sur la dernière maison. S’il y a des robots malades ou incubés, appliquer la règle de distribution ci-dessus._

    Pour lieu Robot academie :
        Déplacer les pions dans les maisons

Suivre la règle de [priorité de deuxième déplacement](#prioritedeplacement)

### Supermarché


Cartes mesures affectant le comportement :
- [Bonnes pratiques pdt les courses](CARTES_MESURES.md#bonnespratiques) : suppression zone 2

_Les robots de la zone 2 (caisses) rentrent dans les maisons un par un, selon la même règle que pour la robot académie._

    Pour lieu Battery market zone 2 :
        Déplacer les pions dans les maisons

Suivre la règle de [priorité de deuxième déplacement](#prioritedeplacement)

_Les robots de la zone 1 (rayons) vont en zone 2 (caisses)_

    Pour lieu Battery market zone 1 :

        Déplacer les pions dans la zone 2 

## Étape 4 : Gestion des malades

Cartes mesures affectant le comportement :
- [Hôpital militaire](CARTES_MESURES.md#militaire) : augmentation capacité colonnes hôpital

### Libérer des places au garage

_Les robots se déplacent à chaque tour de colonne en colonne. Vous allez donc vous occuper des colonnes les unes après les autres de droite à gauche (d’abord C puis B puis A)_

#### Colonne C

_Lancez un dé par robot : si 1 ou 2, Le robot est guéri et rentre chez lui. Enlevez le robot du garage et placez un robot guéri dans la maison indiquée par le marqueur de retours et déplacer le marqueur d’une maison dans le sens horaire. si 6, le robot sort du jeu._

    Pour chaque pion dans la colonne C :
        Tirer au hasard un chiffre de 1 à 6 (dé)
        Si(dé == 6) Retirer le pion du jeu
        Si(dé < 3) :
            le pion devient guéri
            ajouter le pion dans la maison qui a le marqueur planète
            avancer le marqueur planète

#### Colonne B

_Lancez un dé par robot : si 1, Le robot est guéri et rentre chez lui._

    Pour chaque pion dans la colonne B :
        Tirer au hasard un chiffre de 1 à 6 (dé)
        Si(dé < 2) :
            le pion devient guéri
            ajouter le pion dans la maison qui a le marqueur planète
            avancer le marqueur planète
        Sinon :
            Si des places sont disponibles colonne C :
                déplacer le pion en colonne C

#### Colonne A

_Déplacez les robots sur les places disponibles en colonne B. S’il n’y a pas suffisamment de place dans la colonne B, ces derniers restent à leur place en
colonne A._

    Pour chaque pion dans la colonne A :
        Si des places sont disponibles colonne B :
            déplacer le pion en colonne B

### Hospitalisation des cas les plus graves

Cartes mesures affectant le comportement :
- [Interdiction de venir aux urgences](CARTES_MESURES.md#urgences) : seulement le 6 envoie à l'hôpital
- [Découverte de traitements](CARTES_MESURES.md#traitement) : dé 1, 2 et 3 guérissent

_Pour chaque robot malade sur le plateau (hors garage), lancez un dé. Si 1, Bonne nouvelle ! Le robot est guéri (remplacez le robot malade par un guéri) ; si 5 ou 6, le robot malade est envoyé au garage en colonne A_

    Pour chaque lieu hors hopital :
        Pour chaque pion malade :
            Tirer au hasard un chiffre de 1 à 6 (dé)
            Si(dé > 4) déplacer le pion à l'hôpital
            Si(dé == 1) le pion devient guéri

_Gestion du garage : si la colonne A est pleine, compléter la colonne B puis la colonne C._
    
    Déplacement à l'hôpital :
        Si des places sont disponibles colonne A :
            positionner le pion en colonne A
        Sinon si des places sont disponibles colonne B :
            positionner le pion en colonne B
        Sinon positionner le pion en colonne B

## Étape 5 : Prise de mesures de protection des robots

_Comptez le nombre de lieux (garage exclu) présentant au moins 1 robot malade et placez votre marqueur sur le niveau de crise correspondant (0, 1 ou 2)._

### Mettre à jour le curseur crise et Calculer le nombre de points de mesure disponibles <a id="curseurcrise"></a>

_Le niveau de crise représente la conscience de vos concitoyens sur la dangerosité de la situation. Plus il est élevé, plus la population peut accepter des mesures contraignantes et qui ont donc un coût de mesure élevé. Le niveau de crise ne peut en aucun cas redescendre. Les points de mesure supplémentaires acquis le sont donc pour le reste de la partie._

    Si (nombre de lieux avec au moins un malade > 10)
        echelle crise = max(2, echelle crise)
    Sinon si (nombre de lieux avec au moins un malade > 5)
        echelle crise = max(1, echelle crise)
    Sinon echelle crise = max(0, echelle crise)

_Le nombre de points de mesure disponibles a chaque tour y est indiqué, il varie a chaque tour_

    Nombre de points de mesure par tour (de tour 1 à tour 10) : [1,2,3,3,3,3,5,3,3,3] // il conviendra d'y ajouter les points de crise

_Calculer le nombre de points de mesure dont vous disposez, il vous faut additionner le nombre de points de mesure disponibles à votre tour de jeu et le nombre de points de mesure
supplémentaires liés à votre niveau de crise._

    Nombre total de points de mesure = Nombre de points de mesure par tour[N° tour] + echelle crise

### Jouer les cartes mesures

_Vous pouvez choisir une ou plusieurs cartes mesures pour un total de point inférieur ou égale aux points de mesure disponibles. Posez les, face visible, à coté du plateau. Vous pourrez appliquer leurs effets dès le tour suivant. Les cartes mesures sont actives jusqu’à la fin de la partie._

    Pour chaque carte mesure choisie par le joueur :
        Enregistrer la carte choisie
        Mettre à jour les variables du jeu avec les effets de la carte
        Enlever la carte mesure de la main

Voir page [CARTES_MESURES.md](CARTES_MESURES.md)

## Étape 6 : Gestion des évènements

_Piocher une carte événement et appliquer ses effets. Replacer la carte dans la pile de cartes évènement et mélanger la pile._

    Pour chaque carte événement choisie par le joueur :
        Enregistrer la carte choisie
        Appliquer les effets
        Enregistrer les effets tour + 1
        Remettre la carte événement dans la main

Voir page _CARTES EVENEMENTS (**TO-DO**)_

## TOUR FINI

_A chaque tour, vous avancerez le marqueur de la colonne « tour » d’une case._

    Echelle tour += 1

Voir [conditions de fin de partie](#findepartie)
