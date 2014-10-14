module.exports = function(grunt) {

  var pkg = grunt.file.readJSON("package.json"),
      mnf = grunt.file.readJSON("code/manifest.json"),
      fileMaps = { browserify: {}, uglify: {} },
      jsFiles = grunt.file.expand(["code/js/**/*.js", "!code/js/lib/*"]),
      htmlFiles = grunt.file.expand(["code/html/*.html"]),
      file,
      files = grunt.file.expand({cwd:"code/js/"}, ["**/*.js"]);

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    fileMaps.browserify["build/unpacked-dev/js/" + file] = "code/js/" + file;
    fileMaps.uglify["build/unpacked-prod/js/" + file] = "build/unpacked-dev/js/" + file;
  }

  grunt.initConfig({

    clean: ["build/unpacked-dev", "build/unpacked-prod", "test/streamkeys-ext"],

    mkdir: {
      unpacked: { options: { create: ["build/unpacked-dev", "build/unpacked-prod"] } },
      js: { options: { create: ["build/unpacked-dev/js"] } }
    },

    copy: {
      main: { files: [ {
        expand: true,
        cwd: "code/",
        src: ["**", "!js/**", "!**/*.md"],
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
        dest: "test/streamkeys-ext/"
      } ] },
      test_prod: { files: [ {
        expand: true,
        cwd: "build/unpacked-prod",
        src: ["**"],
        dest: "test/streamkeys-ext/"
      } ] }
    },

    browserify: {
      build: {
        files: fileMaps.browserify,
        options: { bundleOptions: {
          debug: true,  // for source maps
          standalone: pkg["export-symbol"]
        } }
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
      tasks: ["dev"] // let machines suffer
    },

    exec: {
      run_tests: {
        command: "node test/runner.js"
      }
    },

    replace: {
      prod: {
        src: ["code/js/background.js"],
        dest: "code/js/background.js",
        replacements: [{
          from: /\/\/[ ]*chrome\.tabs\.create\({url: "http:\/\/www\.streamkeys\.com\/guide.html/gm,
          to: 'chrome.tabs.create({url: "http://www.streamkeys.com/guide.html'
        }]
      },
      dev: {
        src: ["code/js/background.js"],
        dest: "code/js/background.js",
        replacements: [{
          from: /^( *)chrome\.tabs\.create\({url: "http:\/\/www\.streamkeys\.com\/guide.html/gm,
          to: '$1//chrome.tabs.create({url: "http://www.streamkeys.com/guide.html'
        }]
      }
    },

    growl : {
      build_success : {
        message : "extension built successfully!",
        title : "Grunt",
        image: __dirname + "/code/icon128.png"
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-compress");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-exec");
  grunt.loadNpmTasks("grunt-mkdir");
  grunt.loadNpmTasks("grunt-lintspaces");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-text-replace");
  grunt.loadNpmTasks('grunt-growl');

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
  grunt.registerTask("dev", ["replace:dev", "jshint", "lintspaces", "clean", "mkdir:unpacked", "copy:main", "manifest",
    "mkdir:js", "browserify", "copy:test_dev",  "growl:build_success"]);
  grunt.registerTask("rel", ["jshint", "lintspaces", "clean", "mkdir:unpacked", "copy:main", "manifest",
    "mkdir:js", "browserify", "copy:prod", "uglify", "copy:test_prod", "compress:rel"]);
  grunt.registerTask("rel-store", ["replace:prod", "rel"]);
};
