process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({
    basePath: "",

    plugins: [
      "@metahub/karma-jasmine-jquery",
      "karma-*"
    ],

    frameworks: [
      "browserify",
      "jasmine-jquery",
      "jasmine",
      "sinon-chrome"
    ],

    files: [
      "node_modules/sinon/pkg/sinon.js",
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

    browsers: ["ChromeHeadless"],

    browserify: {
      debug: true,
      transform: []
    },

    client: {
      jasmine: {
        random: false
      }
    }
  });
};
