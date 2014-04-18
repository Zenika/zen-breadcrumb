// Karma configuration

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'lib/zen-breadcrumb.js',
      'test/**/*.js'
    ],
    reporters: ['progress'],
    browsers: ['PhantomJS'],
    singleRun: true
  });
};
