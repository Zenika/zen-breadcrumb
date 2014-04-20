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
[doc du ui-router](http://angular-ui.github.io/ui-router/site/#/api/ui.router.state.$state), nous pouvons voir que le service
`$state` permet l'accès à l'état courant et à sa hiérarchie. L'intitulé des étapes du fil d'Ariane peut être paramétré
au niveau de l'état dans le `$stateProvider` via la propriété `data`.

Toutefois le chemin ne sera pas aisé, à ce stade de la réflexion quelques difficultés se profilent :
- Un fil d'Ariane digne de ce nom doit comporter des liens, des liens *valides* donc.
- Certains états admettent des paramètres, ils sont dynamiques (pour la page de détail d'une entité par exemple). Et
logiquement, l'intitulé dans le fil d'Ariane doit l'être tout autant.

Cette solution est finalement très générique, le fil d'Ariane se contente de reprendre les informations présentes dans
la configuration du ui-router (qui est elle, très spécifique). La fonctionnalité peut donc être implémentée sous la
forme d'un module Angular à part, injectable dans toute application Angular utilisant le ui-router.

## Architecture
Il est temps de poser les bases de l'architecture qui vont nous permettre de développer le module qui deviendra
[angular-breadcrumb](https://github.com/ncuillery/angular-breadcrumb). Elle doit gérer :
- le build
- les tests
- une application exemple

Nous nous baserons sur [Grunt](http://gruntjs.com/) qui est un des outils d'industrialisation les plus en vogue du monde
Javascript.

### Scaffolding
Beaucoup pensent à [Yeoman](http://yeoman.io/) (et plus précisement `yo`) au sujet de la génération d'un projet
Javascript. Le template angular pour `yo` est très complet. C'est très bien pour une application Angular mais trop
étoffé pour notre simple module avec son application exemple (dont la vocation est d'avoir les sources les plus claires
possibles).

Mais Grunt a également des fonctionnalités de génération de code, via la commande `grunt-init`. C'est un module npm à part qu'il
faut installer :
```
npm install -g grunt-init
```
L'exécutable requièrt le téléchargement d'un template via un `git clone` sur un des templates officiels. En l'occurence
le [commonjs](https://github.com/gruntjs/grunt-init-commonjs) qui est adapté à notre besoin.

Nous pouvons alors générer le projet avec la commande :
```
grunt-init commonjs
```
Après quelques questions posées par `grunt-init`, nous avons un projet fonctionnel avec :
- une industrialisation GruntJS (forcément !)
- un fichier source `lib/zen-breadcrumb.js` compilable avec la commande `grunt`
- un fichier de test `test/zen-breadcrumb_test.js` (qui passe !) utilisant nodeunit comme framework de test
- un répertoire `dist` qui contient, après compilation, une version complète et une version minifiée de la lib.
- les fichiers de base d'une librairie javascript open-source hébergée sur Github (README.md, .gitignore, .jshintrc, etc.)

Pas d'Angular en vue encore mais les bases sont là !

**Source :** [5d840cedee](https://github.com/Zenika/zen-breadcrumb/tree/5d840cedee48d95f3e43c4be6329c340efcf99a9)

### Build

Le workflow d'industrialisation convient à 90% pour le développpement de la librairie. La seule modification que nous
allons apporter est le remplacement du lanceur de test NodeUnit par Karma.

Commençons par le fichier `package.json` qui contient les informations demandées lors de la génération. C'est la carte d'identité du projet.
Les informations sont purement informatives dans notre cas (la librairie n'est pas un module npm !) à l'exception de la
propriété `devDependencies` qui doit contenir les modules utiles au développement (Grunt & ses plugins notamment).

Dans les `devDependencies` figure NodeUnit (sous forme de plugin Grunt). Nous le remplaçons par
[Karma](http://karma-runner.github.io/) qui est le lanceur de test développé par la team Angular. Il est largement répandu
dans la communauté Angular (et Javascript en général).
```js
  [...]
  "devDependencies": {
    "grunt-contrib-concat": "~0.3.0",
    "grunt-contrib-uglify": "~0.2.0",
    "grunt-contrib-jshint": "~0.6.0",
    //"grunt-contrib-nodeunit": "~0.2.0",
    "grunt-contrib-watch": "~0.4.0",
    "grunt": "~0.4.4",
    "karma": "~0.12.8", // Lanceur de test
    "karma-jasmine": "~0.2.0", // API de test
    "karma-phantomjs-launcher": "~0.1.4", // Lanceur de navigateur
    "grunt-karma": "~0.8.2" // Plugin pour lancer Karma dans une tâche Grunt
  },
  [...]
```
Note : Toute modification dans les dépendances de `package.json` nécessite l'exécution de la commande `npm install`

Karma nécessite un fichier de configuration `karma.conf.js` qui va contenir notamment :
- le framework de test (librairie JS proposant l'API de test, ici : Jasmine)
- l'emplacement des fichiers de test (appellés "specs"), des fichiers à tester et d'éventuelles dépendances
- les navigateurs sur lesquels les tests vont être exécutés
- le format des rapports d'exécution des tests
```js
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'lib/zen-breadcrumb.js', // Librairie à tester
      'test/**/*.js' // Specs
    ],
    reporters: ['progress'], // Affiche la progression des tests dans la console
    browsers: ['PhantomJS'], // Navigateur Webkit sans interface graphique (headless)
    singleRun: true // Fin du processus à la fin de l'exécution
  });
};
```

Enfin, le plugin grunt-karma nécessite la déclaration d'une tâche dans le `Gruntfile.js` qui remplace celle de nodeunit :
```js
  [...]
  //nodeunit: {
  //  files: ['test/**/*_test.js']
  //},
  karma: {
    unit: {
      configFile: 'karma.conf.js'
    }
  },
  [...]
  //grunt.loadNpmTasks('grunt-nodeunit');
  grunt.loadNpmTasks('grunt-karma');
  [...]
  //grunt.registerTask('default', ['jshint', 'nodeunit', 'concat', 'uglify']);
  grunt.registerTask('default', ['jshint', 'karma', 'concat', 'uglify']);
  grunt.registerTask('test', ['jshint', 'karma']);
  [...]
```

Les tests peuvent maintenant être exécutés avec la commande :
```
grunt test
```

Toujours pas d'Angular, mais nous avons préparé le terrain en mettant en place Karma.

**Commit :** [83d16f8681](https://github.com/Zenika/zen-breadcrumb/commit/83d16f868138f18e4860cf51e327fe8df55fca07) (Note :
la mise en place de test de module RequireJS ne concernant pas le sujet de l'article, le test a été réduit à l'extrême (avec la syntaxe
Jasmine tout de même)

### Dépendances
Après avoir construit un cadre de build et de test, nous allons utiliser [Bower](http://bower.io/). Bower va servir
à 2 choses :
- Gérer les dépendances du module (Angular et ui-router)
- Publier les informations à destination des projets qui utiliseront le module (le module devient lui-même une
dépendance Bower)

Bower est un module npm qui pourrait figurer dans le `package.json` avec Grunt et Karma, cependant il est de tradition de
l'installer au niveau global avec la commande :
```
npm install -g bower
```

Nous créons un fichier `bower.json` dans le dossier racine qui sera la carte d'identité du projet du point de vue de
Bower (comme l'est le `package.json` pour npm) :
```js
{
  "name": "zen-breadcrumb", // Nom de la librairie
  "version": "0.1.0", // Version de la librairie
  "main": "dist/zen-breadcrumb.js", // Chemin du fichier principal
  "dependencies": {
    "angular": ">=1.0.8",
    "angular-ui-router": ">=0.2.0"
  },
  "devDependencies": {
    "angular-mocks": ">=1.0.8"
  }
}
```
Nous retrouvons les mêmes champs que dans le `package.json`, à la différence que ces informations ont vraiment un rôle :
Elles sont indispensables à l'utilisation de la librairie en tant que dépendance Bower.

La propriété `dependencies` définit les prérequis de la librairie, en l'occurence : Angular et le ui-router.

La propriété `devDependencies` définit les dépendances pour le développement uniquement (elles ne sont pas
téléchargées par les projets utilisant notre librairie). Ici, nous n'allons avoir besoin que du module de tests unitaires
d'Angular.

Maintenant que les dépendances ont été déclarées, il faut les installer en lançant la commande :
```
bower install
```
Par défaut, elles se trouvent dans le dossier `bower_components`.

Nous pouvons maintenant initialiser un module Angular dans le fichier `lib/zen-breadcrumb.js` qui déclare le module du
ui-router en dépendance :
```js
angular.module('zen-breadcrumb', ['ui.router.state']);
```

Et son test :
```js
describe('The module zen-breadcrumb', function() {

    beforeEach(function() {
        module('zen-breadcrumb');
    });

    it('is loaded', function() {
        var zenBreadcrumb = angular.module('zen-breadcrumb');  // angular.module avec 1 seul argument --> Getter
        expect(zenBreadcrumb.name).toBe('zen-breadcrumb');
    });

    it('has a $state service', inject(function($state) {
        expect($state).toBeDefined(); // Service du ui-router
    }));

});
```

Nous avons maintenant un module Angular (vide) prêt à être développé dans une architecture adaptée avec :
- Mécanisme de build (minification)
- Tests
- Gestion des dépendances

**Commit :** [612e1ec855](https://github.com/Zenika/zen-breadcrumb/commit/612e1ec85540bd88f0d34a49f1217792bb6807bb)

## Développement
