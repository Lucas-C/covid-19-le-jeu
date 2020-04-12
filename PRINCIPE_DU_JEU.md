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

### Fin de la partie

_La partie prend fin immédiatement :_

- _SOIT quand tous les pions malades sont à l’hôpital et qu’il ne reste plus sur le plateau que des pions sains ou guéris. Vous avez gagné !_
- _SOIT quand un pion malade ne peut être admis à l’hôpital faute de place disponible (étape 5). Dans ce cas vous avez perdu…_

  Pour chaque lieu hors hôpital :
  Nombre total de malades += Nombre de malades du lieu
  Si(Nombre total de malades = 0)
  YOU WIN !

  Pour l'hôpital :
  Si(Nombre de malades > capacité totale )
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
    Echelle tour = 0

_Le nombre de points de mesure disponibles a chaque tour y est indiqué, il varie a chaque tour_

    Nombre de points de mesure par tour (de tour 1 à tour 10) : [1,2,3,3,3,3,5,3,3,3] // il conviendra d'y ajouter les points de crise

_Le niveau de crise représente la conscience de vos concitoyens sur la dangerosité de la situation. Plus il est élevé, plus la population peut accepter des mesures contraignantes et qui ont donc un coût de mesure élevé. Le niveau de crise ne peut en aucun cas redescendre. Les points de mesure supplémentaires acquis le sont donc pour le reste de la partie._

    Si (nombre de lieux avec au moins un malade > 10)
        echelle crise = max(2, echelle crise)
    Sinon si (nombre de lieux avec au moins un malade > 5)
        echelle crise = max(1, echelle crise)
    Sinon echelle crise = max(0, echelle crise)

    Nombre total de points de mesure = Nombre de points de mesure par tour[N° tour] + echelle crise

## Etape 1 : début du tour

_A chaque tour, vous avancerez le marqueur de la colonne « tour » d’une case._

    Echelle tour += 1

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
            Pour chaque maison cratère :
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

Suivre la règle de [priorité de deuxième déplacement](#prioritedeplacement)

### Supermarché

*TO-DO*

## Étape 4 : Gestion des malades

*TO-DO*

## Étape 5 : Prise de mesures de protection des robots

*TO-DO*

## Étape 6 : Gestion des évènements

*TO-DO*