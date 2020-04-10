<!-- To update this ToC: npm run update-toc -->

<!-- toc -->

- [Introduction](#introduction)
- [Gestions des tâches](#gestions-des-taches)
- [Contribuer au code](#contribuer-au-code)
    * [Environnement de développement](#environnement-de-developpement)
    * [Commandes utiles](#commandes-utiles)
        + [Installation des dépendances](#installation-des-dependances)
        + [Lancement du jeu en local](#lancement-du-jeu-en-local)
        + [Linter & tests](#linter--tests)
    * [Intégration continue](#integration-continue)
    * [Revues de code](#revues-de-code)
- [Remerciements](#remerciements)

<!-- tocstop -->

# Introduction

Tout d'abord, merci d'envisager de contribuer à ce projet !

Vous pouvez nous aider de bien des manières :
- tout d'abord, en nous faisant **vos retours** ! Dites-nous ce que vous en pensez sur [notre canal gitter](https://gitter.im/covid-19-le-jeu/community)
- vous pouvez également **parlez du jeu à vos proches & amis** !
- vous pouvez nous signaler d'éventuels **bugs** via [gitter](https://gitter.im/covid-19-le-jeu/community) ou en créant une [issue](https://github.com/covid19lejeu/covid-19-le-jeu/issues)
- vous pouvez aussi **suggérer des fonctionnalités**, à nouveau via [gitter](https://gitter.im/covid-19-le-jeu/community) ou en créant une [issue](https://github.com/covid19lejeu/covid-19-le-jeu/issues)
- enfin, vous pouvez **contribuer au code** : pour cela, lisez la section "[contribuer au code](#contribuer-au-code)" ci-dessous


# Gestions des tâches

Afin de s'y retrouver, nous découpons les étapes de développement en tâches représentées par des [issues](https://github.com/covid19lejeu/covid-19-le-jeu/issues).

L'onglet [projects](https://github.com/covid19lejeu/covid-19-le-jeu/projects/2) de GitHub permet de suivre leur avancement.


# Contribuer au code

Les contributions à ce projet se font via des _pull requests_.

Voici un peu de documentation sur le sujet, si vous êtes peu familier du principe :
- [tuto sur OpenClassRooms](https://openclassrooms.com/fr/courses/2342361-gerez-votre-code-avec-git-et-github/2433731-contribuez-a-des-projets-open-source)- [tuto sur git-scm.com](https://git-scm.com/book/fr/v2/GitHub-Contribution-%C3%A0-un-projet)

Globalement, voici le processus à suivre pour contribuer :
1. Mettez en place votre [environnement de développement](#environnement-de-developpement)
2. Assurez-vous qu'il existe une [_issue_](https://github.com/covid19lejeu/covid-19-le-jeu/issues) détaillant ce que vous comptez corriger ou implémenter.
Idéalement, indiquez en commentaire sur cette _issue_ que vous commencez à vous pencher sur la question, afin d'éviter que plusieurs personnes y travaillent en même temps.
3. **Codez !**
Suivez lez recommendations de ce guide, et n'hésitez pas à poser vos questions sur [le chat gitter](https://gitter.im/covid-19-le-jeu/community)
4. Commitez & poussez votre code sur une branche dédiée de votre _fork_, puis créez une _pull request_ sur GitHub.
Un ensemble de checks d'[intégration continue](#integration-continue) s'effectuera alors via _GitHub Actions_ :
s'ils ne sont pas **tous verts**, assurez-vous de modifier votre code en fonction des erreurs detectées,
puis de commiter & pousser à nouveau sur cette branche.
5. Un membre de l'équipe de développement effectuera alors une [revue de code](#revues-de-code).
Un échange de remarques & suggestions aura probablement lieu dans la _pull request_ :
à des nouveaux, si des modifications sont demanées, commitez & poussez à nouveau sur cette branche.
6. Enfin, votre contribution sera adoptée : le code sera _mergé_ dans la branche `master` en _squashant_ les commits
Bravo !

## Environnement de développement

Vous aurez besoin
- de `git` : https://git-scm.com/book/fr/v2/D%C3%A9marrage-rapide-Installation-de-Git
- de `npm` : https://www.npmjs.com/get-npm


## Commandes utiles
### Installation des dépendances

    npm install

### Lancement du jeu en local
N'importe quel serveur web peut faire l'affaire :

    npm start

### Linter & tests

    npm run lint
    npm test

Nous employons `eslint` comme _linter_ (= outil d'analyse statique) pour analyser le code Javascript et assurer sa cohérence de style : https://eslint.org
Les règles régissant son comportement sont définies dans le fichier `.eslintrc.js`.


## Intégration continue

Nous employons [GitHub Actions](https://help.github.com/en/actions) pour effectuer plusieurs rapides validations du code à chaque commit / _pull request_ :
https://github.com/covid19lejeu/covid-19-le-jeu/actions

Cette _pipeline_ d'[intégration continue](https://fr.wikipedia.org/wiki/Int%C3%A9gration_continue) est définie dans le fichier `.github/workflows/continuous-integration-workflow.yml`

## Revues de code

Chaque _pull request_ est relue par un membre de l'équipe de développement du project,  et doit avoir son approbation.

Voici quelques _guidelines_ pour les réaliser :
- [Code review : ce truc qui ne sert à rien - Sebastien Charrier](https://www.youtube.com/watch?v=6aQK6GoTbxM)
- [yelp guidelines](https://engineeringblog.yelp.com/2017/11/code-review-guidelines.html)


# Remerciements

Un grand merci à tous les [contributeurs](CONTRIBUTORS.md) !
