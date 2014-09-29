var Mocha = require("mocha"),
    fs = require("fs"),
    path = require("path");

var mocha = new Mocha({timeout: 20000, title: "Streamkeys tests"});

var testDir = path.resolve(path.join(path.dirname(fs.realpathSync(__filename)), "controllers"));
console.log(testDir);
fs.readdirSync(testDir).filter(function(file){
  //Only keep the .js files
  return file.substr(-3) === ".js";
}).forEach(function(file){
  console.log("ADDING: ", path.join(testDir, file));
  // mocha.addFile(
  //   path.join(testDir, file)
  // );
});

mocha.addFile(path.join(testDir, "difm.js"));
mocha.addFile(path.join(testDir, "grooveshark.js"));
// mocha.addFile(path.join(testDir, "edge.js"));
mocha.addFile(path.join(testDir, "hypem.js"));
mocha.addFile(path.join(testDir, "bandcamp.js"));

mocha.run(function(failures) {
  process.on("exit", function () {
    process.exit(failures);
  });
});
