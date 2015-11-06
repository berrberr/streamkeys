module.exports = function(config) {
  config.set({
    basePath: "",

    frameworks: [
      "browserify",
      "jasmine"
    ],

    files: [
      "node_modules/sinon/pkg/sinon.js",
      "node_modules/sinon-chrome/chrome.js",
      "node_modules/sinon-chrome/src/phantom-tweaks.js",
      "test/**/*.test.js"
    ],

    preprocessors: {
      "test/**/*.test.js": ["browserify"]
    },

    reporters: ["progress"],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ["PhantomJS"],

    browserify: {
      debug: true,
      transform: []
    },

    plugins: [
      "karma-phantomjs-launcher",
      "karma-jasmine",
      "karma-browserify"
    ]
  });
};
