var Mocha = require("mocha"),
    getPath = require("./shared/helpers.js").getPath;

var mocha = new Mocha({timeout: 20000, title: "Streamkeys tests", ui: "bdd"});

mocha.addFile(getPath(__filename, "/_base_suite.js"));

mocha.run(function(failures) {
  process.on("exit", function () {
    process.exit(failures);
  });
});
