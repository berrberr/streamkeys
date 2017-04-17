module.exports = function(config) {
  config.set({
    basePath: "",

    frameworks: [
      "browserify",
      "jasmine-jquery",
      "jasmine"
    ],

    files: [
      "node_modules/sinon/pkg/sinon.js",
      "node_modules/sinon-chrome/chrome.js",
      "test/**/*.test.js",
      "test/fixtures/*.html"
    ],

    preprocessors: {
      "test/**/*.test.js": ["browserify"]
    },

    reporters: ["spec"],

    port: 9876,

    colors: true,

    // LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG
    logLevel: config.LOG_INFO,

    autoWatch: true,

    singleRun: true,

    browsers: ["PhantomJS2"],

    browserify: {
      debug: true,
      transform: [ 'babelify' ]
    }
  });
};
