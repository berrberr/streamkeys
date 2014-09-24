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
    },
    compress: {
      main: {
        options: {
          archive: "streamkeys.zip",
          pretty: true
        },
        expand: true,
        src: ["*.*", "background/**", "contentscript/**", "controllers/**", "css/**", "lib/**"]
      }
    },
  });


  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-lintspaces");
  grunt.loadNpmTasks("grunt-contrib-compress");
  grunt.registerTask("lint", ["jshint"]);
  grunt.registerTask("rel", ["jshint", "lintspaces", "compress"]);
  grunt.registerTask("default", ["lint", "lintspaces"]);
};
