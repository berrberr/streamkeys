var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');

var mocha = new Mocha({timeout: 20000});

var testDir = path.resolve(path.join(path.dirname(fs.realpathSync(__filename)), 'controllers'));
console.log(testDir);
fs.readdirSync(testDir).filter(function(file){
  // Only keep the .js files
  return file.substr(-3) === '.js';
}).forEach(function(file){
  console.log("ADDING: ", path.join(testDir, file));
  mocha.addFile(
    path.join(testDir, file)
  );
});

// console.log("Suite: ", mocha.suite);

// Mocha.suite("testing", function() {
//   console.log("OHHIL ", this);
// });

// Now, you can run the tests.
mocha.run(function(failures){
  process.on('exit', function () {
    process.exit(failures);
  });
});
