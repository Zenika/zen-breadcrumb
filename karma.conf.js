// Karma configuration

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'lib/zen-breadcrumb.js',
      'test/**/*.js'
    ],
    reporters: ['progress'],
    browsers: ['PhantomJS'],
    singleRun: true
  });
};
