var helpers = require("./helpers.js");

exports.shouldBehaveLikeAMusicSite = function(€) {
  console.log("we here bro");
  console.log(this);
  console.log(this.driver);

  it("should play", function() {
    this.driver.executeScript(helpers.eventScript("playPause")).then(function() {
      this.driver.manage().logs().get("browser").then(function(ent) {
        console.log(ent);
        expect(helpers.parseLog(ent)).to.be.true;
      });
    });
  });
}
