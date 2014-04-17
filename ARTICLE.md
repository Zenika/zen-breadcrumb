# Article
## Introduction
Cet article raconte une histoire, celle du module [angular-breadcrumb](https://github.com/ncuillery/angular-breadcrumb).
A l'origine, c'est une réflexion au sujet d'une application nécessitant un fil d'Ariane : le module
[ui-router](https://github.com/angular-ui/ui-router), très répandu dans l'écosystème Angular, va plus loin que le routeur
natif d'AngularJS en permettant de définir des états (équivalent aux "routes") hiérarchisés (relation parent/enfant).

Toute application utilisant le ui-router comporte donc un arbre d'états qui représente l'exhaustivité du contenu. Or le
concept du fil d'Ariane est de présenter pour chaque page de l'application toutes les étapes de navigation qui ont permis
l'accès à la page. Le concept saute alors aux yeux : les étapes du fil d'Ariane vont représenter l'état courant et toute sa
hiérarchie.

L'idée est intéressante car la fonctionnalité peut être réalisée sans développement spécifique par page, le concept sied
bien au principe des directives Angular, le principe est fiable, la maintenance aisée, etc. En examinant la
[doc du ui-router](http://angular-ui.github.io/ui-router/site/#/api/ui.router.state.$state), on peut voir que le service
`$state` permet l'accès à l'état courant et à sa hiérarchie. L'intitulé des étapes du fil d'Ariane pourra être paramétré
au niveau de l'état dans le `$stateProvider` via la propriété `data`.

Toutefois le chemin ne sera pas aisé, à ce stade de la réflexion quelques difficultés se profilent :
- Un fil d'Ariane digne de ce nom doit comporter des liens, des liens *valides* donc.
- Certains états admettent des paramètres, ils sont dynamiques (pour la page de détail d'une entité par exemple). Et
logiquement, l'intitulé dans le fil d'Ariane devra l'être tout autant.

Cette solution est finalement très générique, le fil d'Ariane se contente de reprendre les informations présentes dans
la configuration du ui-router (qui est elle, très spécifique). La fonctionnalité peut donc être implémentée sous la
forme d'un module Angular à part, injectable dans toute application Angular utilisant le ui-router.