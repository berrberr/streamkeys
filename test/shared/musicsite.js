var webdriver = require("selenium-webdriver");

exports.shouldBehaveLikeAMusicSite = function(driver, url) {

  describe("music site behaviour", function() {

    before(function() {
      // Extension not loaded error message
      this.skLoadError = new Error("Page not loaded!");

      // Has the page and extension loaded properly
      this.loadError = false;

      // Are we on the first test
      this.firstTest = true;
    });

    it("should load", function(done) {
      var self = this,
          pageLoad = true;
      this.firstTest = false;

      if(url) {
        pageLoad = false;
        helpers.getAndWait(driver, url)
        .then(function() {
          pageLoad = true;
        })
        .thenCatch(function(err) {
          console.log("Driver Timeout!", err);
          pageLoad = true;
          throw this.skLoadError;
        });
      }

      driver.wait(function() {
        return pageLoad;
      })
      .then(function() {
        helpers.alertCheck(driver).then(function() {
          console.log("Alert check done!\nStarting waitforload");
          helpers.waitForLoad(driver)
          .then(function() {
            console.log("Wait for load done!");
            // Wait for Streamkeys attached console message
            helpers.waitForExtensionLoad(driver, {count: 0})
            .then(function(result) {
              console.log("Extension loaded!");
              expect(result).to.be.true;
              done();
            }, function(err) {
              console.log(err);
              throw this.skLoadError;
            });
          }, function(err) {
            console.log("Driver Timeout!", err);
            throw this.skLoadError;
          });
        });
      });
    });

    it("should play", function(done) {
      helpers.playerAction(driver, {action: "playPause"})
      .then(function(result) {
        expect(result).to.be.true;
        done();
      });
    });

    it("should pause", function(done) {
      helpers.playerAction(driver, {action: "playPause"})
      .then(function(result) {
        expect(result).to.be.true;
        done();
      });
    });

    it("should play next", function(done) {
      helpers.playerAction(driver, {action: "playNext"})
      .then(function(result) {
        expect(result).to.be.true;
        done();
      });
    });

    it("should play previous", function(done) {
      helpers.playerAction(driver, {action: "playPrev"})
      .then(function(result) {
        expect(result).to.be.true;
        done();
      });
    });

    it("should mute", function(done) {
      helpers.playerAction(driver, {action: "mute"})
      .then(function(result) {
        expect(result).to.be.true;
        done();
      });
    });

  });
};
