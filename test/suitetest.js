var Mocha = require("mocha"),
    fs = require("fs"),
    path = require("path");

var mocha = new Mocha({timeout: 20000, title: "Streamkeys tests"}),
    basePath = path.join(path.dirname(fs.realpathSync(__filename)));

mocha.addFile(basePath + "/basesuite.js");

mocha.run(function(failures) {
  console.log("PROCESS: " + process);
  process.on("exit", function () {
    process.exit(failures);
  });
});
