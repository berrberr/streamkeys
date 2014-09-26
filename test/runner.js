var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');

// First, you need to instantiate a Mocha instance.
var mocha = new Mocha({timeout: 20000});

// Then, you need to use the method "addFile" on the mocha
// object for each file.

// Here is an example:
fs.readdirSync('controllers').filter(function(file){
    // Only keep the .js files
    return file.substr(-3) === '.js';

}).forEach(function(file){
    console.log("ADDING: ", path.join('controllers', file));
    // Use the method "addFile" to add the file to mocha
    mocha.addFile(
        path.join('controllers', file)
    );
});

console.log("MOCHA: ", mocha);
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
