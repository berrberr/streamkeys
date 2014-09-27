var base = require("../basetest.js"),
    test = base.test,
    driver = base.getDriver();

test.describe("Bandcamp", function() {

  test.before(function() {
    driver.get("http://www.bandcamp.com");
    console.log("INSIDE: ", this);
  });

  test.after(function() {
    driver.quit();
  });

  shared.shouldBehaveLikeAMusicSite(driver);

  // test.it("should play", function() {
  //   driver.executeScript(helpers.eventScript("playPause")).then(function() {
  //     driver.manage().logs().get("browser").then(function(ent) {
  //       //console.log(ent);
  //       //expect(helpers.parseLog(ent)).to.be.true;
  //     });
  //   });
  // });

  // test.it("should pause", function() {
  //   console.log("should not see this till first test is done");
  // })

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
});
