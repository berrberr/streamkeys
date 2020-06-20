"use strict";
module.exports = function(grunt) {

  var pkg = grunt.file.readJSON("package.json"),
    mnf = grunt.file.readJSON("code/manifest.json"),
    fileMaps = { browserify: {} },
    jsFiles = grunt.file.expand(["code/js/**/*.js", "!code/js/lib/*"]),
    htmlFiles = grunt.file.expand(["code/html/*.html", "code/css/*"]),
    file,
    files = grunt.file.expand({cwd:"code/js/"}, ["**/*.js"]);

  for (var i = 0; i < files.length; i++) {
    file = files[i];
    fileMaps.browserify["build/unpacked-dev/js/" + file] = "code/js/" + file;
  }

  grunt.initConfig({

    clean: ["build/unpacked-dev", "build/unpacked-prod", "test-selectors/streamkeys-ext"],

    mkdir: {
      unpacked: { options: { create: ["build/unpacked-dev", "build/unpacked-dev/js", "build/unpacked-prod"] } }
    },

    copy: {
      main: { files: [ {
        expand: true,
        cwd: "code/",
        src: ["**", "!js/**", "!**/*.md", "!**/*.scss"],
        dest: "build/unpacked-dev/"
      } ] },
      prod: { files: [ {
        expand: true,
        cwd: "build/unpacked-dev/",
        src: ["**"],
        dest: "build/unpacked-prod/"
      } ] },
      artifact: { files: [ {
        expand: true,
        cwd: "build/",
        src: [pkg.name + "-" + pkg.version + ".crx"],
        dest: process.env.CIRCLE_ARTIFACTS
      } ] }
    },

    browserify: {
      build: {
        files: fileMaps.browserify
      }
    },

    eslint: {
      target: jsFiles
    },

    watch: {
      files: jsFiles.concat(htmlFiles),
      tasks: ["dev"]
    },

    sass: {
      options: {
        implementation: require("node-sass"),
        sourceMap: true
      },
      prod: {
        files: {
          "build/unpacked-prod/css/popup.css": "code/css/popup.scss",
          "build/unpacked-prod/css/options.css": "code/css/options.scss"
        }
      },
      dev: {
        files: {
          "build/unpacked-dev/css/popup.css": "code/css/popup.scss",
          "build/unpacked-dev/css/options.css": "code/css/options.scss"
        }
      }
    },

    karma: {
      unit: {
        configFile: "karma.conf.js"
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-eslint");
  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-exec");
  grunt.loadNpmTasks("grunt-mkdir");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-karma");

  /* Tasks */
  grunt.registerTask(
    "manifest", "Extend manifest.json with extra fields from package.json",
    function() {
      var fields = ["name", "version", "description"];
      for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        mnf[field] = pkg[field];
      }
      grunt.file.write("build/unpacked-dev/manifest.json", JSON.stringify(mnf, null, 2) + "\n");
      grunt.log.ok("manifest.json generated");
    }
  );

  grunt.registerTask("lint", ["eslint"]);
  grunt.registerTask("test", ["karma"]);
  grunt.registerTask("rel-test", ["rel", "test"]);
  grunt.registerTask("dev-pre", ["eslint", "clean", "mkdir:unpacked", "sass:dev", "copy:main", "manifest"]);
  grunt.registerTask("dev", ["dev-pre", "browserify"]);

  grunt.registerTask("rel", ["eslint", "clean", "mkdir:unpacked", "sass:prod", "copy:main", "manifest", "browserify", "copy:prod"]);
};
