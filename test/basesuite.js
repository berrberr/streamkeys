var base = require("./basetest.js"),
    driver = base.getDriver();


driver.flow_.on("uncaughtException", function(e) {
  console.error("Unhandled error: ", e);
  this.it.skip();
});

describe("Streamkeys suite", function() {

  // beforeEach(function() {
  //   console.log("beforeeach");
  // });

  after(function() {
    driver.quit();
  });

  describe("7digital", function() {
    shared.shouldBehaveLikeAMusicSite(driver, "http://www.7digital.com");
  });
  // describe("8tracks", function() {
  //   shared.shouldBehaveLikeAMusicSite(driver, "http://www.8tracks.com");
  // });
  // describe("bandcamp", function() {
  //   shared.shouldBehaveLikeAMusicSite(driver, "http://www.bandcamp.com");
  // });
  // describe("bop.fm", function() {
  //   shared.shouldBehaveLikeAMusicSite(driver, "http://www.bop.fm");
  // });
  // describe("di.fm", function() {
  //   shared.shouldBehaveLikeAMusicSite(driver, "http://www.di.fm/ambient");
  // });
  describe("earbits", function() {
    shared.shouldBehaveLikeAMusicSite(driver, "http://www.earbits.com");
  });
  describe("edge player", function() {
    shared.shouldBehaveLikeAMusicSite(driver, "http://player.edge.ca");
  });
  describe("grooveshark", function() {
    shared.shouldBehaveLikeAMusicSite(driver, "http://www.grooveshark.com");
  });
  describe("hypemachine", function() {
    shared.shouldBehaveLikeAMusicSite(driver, "http://www.hypem.com");
  });
  describe("iheart", function() {
    shared.shouldBehaveLikeAMusicSite(driver, "http://www.iheart.com");
  });
  describe("last.fm", function() {
    shared.shouldBehaveLikeAMusicSite(driver, "http://www.last.fm/listen");
  });

});
