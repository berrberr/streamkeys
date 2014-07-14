"use strict";

/* global module, require */
module.exports = function(grunt) {

  var jsFiles = ["Gruntfile.js", "options.js", "background/background.js"];

  grunt.initConfig({
    jshint: {
      all: jsFiles,
      options: {
        jshintrc: true,
        reporter: require("jshint-stylish")
      }
    },
    lintspaces: {
      all: {
        src: [
          jsFiles
        ],
        options: {
          editorconfig: ".editorconfig",
          ignores: [
            "js-comments"
          ]
        }
      }
    }
  });


  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-lintspaces");
  grunt.registerTask("lint", ["jshint"]);
  grunt.registerTask("default", ["lint", "lintspaces"]);
};
