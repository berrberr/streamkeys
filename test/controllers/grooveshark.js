(function() {
  var base = require("../basetest.js"),
      shared = require("../musicsite.js"),
      helpers = require("../helpers.js");
      driver = base.driver,
      test = base.test,
      expect = base.expect;

  test.describe("Grooveshark", function() {
    this.timeout(20000);
    //console.log("SCOPE2: ", this);

    test.before(function() {
      driver.get("http://www.grooveshark.com");
    });

    test.after(function() {
      driver.quit();
    });

    it("should play", function() {
      driver.executeScript(helpers.eventScript("playPause")).then(function() {
        driver.manage().logs().get("browser").then(function(ent) {
          console.log(ent);
          expect(helpers.parseLog(ent)).to.be.true;
        });
      });
    });

    //shared.shouldBehaveLikeAMusicSite.apply(that);
    // test.it("loads extension", function() {

    //   // driver.sleep(5000);
    //   // var script = "document.dispatchEvent(new CustomEvent('streamkeys-test', {detail: 'playPause'}));"
    //   // driver.executeScript(script);
    //   // driver.executeScript("console.log('SUP BRO');");
    //   // driver.sleep(2000);
    //   // driver.manage().logs().get("browser").then(function(ent) {
    //   //   console.log(ent);
    //   // });
    // })
  })
})();
