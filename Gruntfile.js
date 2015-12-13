module.exports = function(grunt) {

  var pkg = grunt.file.readJSON("package.json"),
      mnf = grunt.file.readJSON("code/manifest.json"),
      fileMaps = { browserify: {}, uglify: {} },
      jsFiles = grunt.file.expand(["code/js/**/*.js", "!code/js/lib/*"]),
      htmlFiles = grunt.file.expand(["code/html/*.html", "code/css/*"]),
      file,
      files = grunt.file.expand({cwd:"code/js/"}, ["**/*.js"]);

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    fileMaps.browserify["build/unpacked-dev/js/" + file] = "code/js/" + file;
    fileMaps.uglify["build/unpacked-prod/js/" + file] = "build/unpacked-dev/js/" + file;
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
        src: ["**", "!js/*.js"],
        dest: "build/unpacked-prod/"
      } ] },
      artifact: { files: [ {
        expand: true,
        cwd: "build/",
        src: [pkg.name + "-" + pkg.version + ".crx"],
        dest: process.env.CIRCLE_ARTIFACTS
      } ] },
      test_dev: { files: [ {
        expand: true,
        cwd: "build/unpacked-dev",
        src: ["**"],
        dest: "test-selectors/streamkeys-ext/"
      } ] },
      test_prod: { files: [ {
        expand: true,
        cwd: "build/unpacked-prod",
        src: ["**"],
        dest: "test-selectors/streamkeys-ext/"
      } ] }
    },

    browserify: {
      build: {
        files: fileMaps.browserify
      }
    },

    jshint: {
      all: jsFiles,
      options: {
        jshintrc: true,
        reporter: require("jshint-stylish")
      }
    },

    lintspaces: {
      all: {
        src: [jsFiles, "!*.min.js"],
        options: {
          editorconfig: ".editorconfig",
          ignores: ["js-comments"]
        }
      }
    },

    uglify: {
      min: { files: fileMaps.uglify }
    },

    compress: {
      rel: {
        options: {
          archive: "streamkeys.zip",
          pretty: true
        },
        expand: true,
        cwd: "build/unpacked-prod",
        src: "**/*"
      },
      dev: {
        options: {
          archive: "streamkeys-dev.zip"
        },
        expand: true,
        cwd: "build/unpacked-dev",
        src: "**/*"
      }
    },

    watch: {
      files: jsFiles.concat(htmlFiles),
      tasks: ["dev"]
    },

    exec: {
      run_tests: {
        command: "node test-selectors/runner.js"
      }
    },

    sass: {
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

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-compress");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-exec");
  grunt.loadNpmTasks("grunt-mkdir");
  grunt.loadNpmTasks("grunt-lintspaces");
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

  grunt.registerTask("lint", ["jshint", "lintspaces"]);
  grunt.registerTask("test", ["exec:run_tests"]);
  grunt.registerTask("rel-test", ["rel", "test"]);
  grunt.registerTask("dev-pre", ["jshint", "lintspaces", "clean", "mkdir:unpacked", "sass:dev", "copy:main", "manifest"]);
  grunt.registerTask("dev-post", ["copy:test_dev"]);
  grunt.registerTask("dev", ["dev-pre", "browserify", "dev-post"]);

  grunt.registerTask("rel", ["jshint", "lintspaces", "clean", "mkdir:unpacked", "sass:prod", "copy:main", "manifest", "browserify", "copy:prod", "uglify", "copy:test_prod", "compress:rel"]);
  grunt.registerTask("rel-store", ["rel"]);
};
