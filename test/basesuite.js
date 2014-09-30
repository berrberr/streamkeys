var base = require("./basetest.js"),
    driver = base.getDriver();

const TIMEOUT_ERROR = /Wait timed out after ([0-9]* ?)ms/;

//driver.flow_.on("uncaughtException", function(e) {
  //console.log(this);
  // console.log(e.message);
  // console.error("Unhandled error: ", e);
  // if(TIMEOUT_ERROR.test(e.message)) {
  //   console.log("SKIP");
  //this.describe.skip();
  //}
//});

describe("Streamkeys suite", function() {

  after(function() {
    driver.quit();
  });

  describe("7digital", function() {
    shared.shouldBehaveLikeAMusicSite(driver, "http://www.7digital.com");
  });
  // TODO: fix
  // describe("8tracks", function() {
  //   shared.shouldBehaveLikeAMusicSite(driver, "http://www.8tracks.com");
  // });
  describe("bandcamp", function() {
    shared.shouldBehaveLikeAMusicSite(driver, "http://www.bandcamp.com");
  });
  describe("bop.fm", function() {
    shared.shouldBehaveLikeAMusicSite(driver, "http://www.bop.fm");
  });
  describe("di.fm", function() {
    shared.shouldBehaveLikeAMusicSite(driver, "http://www.di.fm/ambient");
  });
  // describe("edge player", function() {
  //   shared.shouldBehaveLikeAMusicSite(driver, "http://player.edge.ca");
  // });
  // describe("grooveshark", function() {
  //   shared.shouldBehaveLikeAMusicSite(driver, "http://www.grooveshark.com");
  // });
  // describe("hypemachine", function() {
  //   shared.shouldBehaveLikeAMusicSite(driver, "http://www.hypem.com");
  // });
  // describe("jango", function() {
  //   shared.shouldBehaveLikeAMusicSite(driver, "http://www.jango.com/stations/263448187/");
  // });
  // describe("last.fm", function() {
  //   shared.shouldBehaveLikeAMusicSite(driver, "http://www.last.fm/listen");
  // });
  // describe("myspace", function() {
  //   shared.shouldBehaveLikeAMusicSite(driver, "http://music.myspace.com");
  // });
  // describe("mixcloud", function() {
  //   shared.shouldBehaveLikeAMusicSite(driver, "http://www.mixcloud.com");
  // });
  // describe("NPR one", function() {
  //   shared.shouldBehaveLikeAMusicSite(driver, "http://one.npr.org");

  //   after(function() {
  //     console.log("After npr sleep");
  //     driver.sleep(5000);
  //   });
  // });
  // describe("pleer", function() {
  //   shared.shouldBehaveLikeAMusicSite(driver, "http://www.pleer.com");
  // });
  // describe("radio paradise", function() {
  //   shared.shouldBehaveLikeAMusicSite(driver, "http://www.radioparadise.com");
  // });
  // // TODO: fix
  // // describe("seesu.me", function() {
  // //   shared.shouldBehaveLikeAMusicSite(driver, "http://seesu.me/o#/catalog/The+Smiths/albums_lfm/The+Smiths/Reel+Around+the+Fountain");
  // // });
  // describe("songstr", function() {
  //   shared.shouldBehaveLikeAMusicSite(driver, "http://www.songstr.com");
  // });
  // describe("soundcloud", function() {
  //   shared.shouldBehaveLikeAMusicSite(driver, "http://www.soundcloud.com");
  // });
  // describe("thesixtyone", function() {
  //   shared.shouldBehaveLikeAMusicSite(driver, "http://www.thesixtyone.com");
  // });
  // describe("tunein", function() {
  //   shared.shouldBehaveLikeAMusicSite(driver, "http://tunein.com");
  // });

});
