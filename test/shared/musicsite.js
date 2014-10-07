var webdriver = require("selenium-webdriver");

exports.shouldBehaveLikeAMusicSite = function(driver, url, sleepAfterCommand) {

  describe("music site behaviour", function() {

    before(function() {
      // Extension not loaded error message
      this.skLoadError = new Error("Streamkeys not loaded!");

      // Has the page and extension loaded properly
      this.loadError = false;

      // Are we on the first test
      this.firstTest = true;

      // Should we sleep after we execute a streamkeys test request?
      // Ugly hack, only used for VK
      this.sleepAfterCommand = sleepAfterCommand || 0;
    });

    /**
     * Check for a load error.
     * If found throw an error to exit out of describe block without running remaining tests.
     */
    beforeEach(function() {
      if(this.loadError && !this.firstTest) throw this.skLoadError;
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
          self.loadError = true;
        });
      }

      driver.wait(function() {
        return pageLoad;
      })
      .then(function() {
        if(self.loadError) throw self.skLoadError;

        helpers.alertCheck(driver).then(function() {
          console.log("Alert check done!\nStarting waitforload");
          helpers.waitForLoad(driver)
          .thenCatch(function(err) {
            console.log("Driver Timeout!", err);
            self.loadError = true;
          })
          .then(function() {
            console.log("Waitforload done!");
            // Wait for Streamkeys attached console message
            driver.wait(function() {
              return driver.manage().logs().get("browser").then(function(log) {
                return helpers.parseLog(log, "Attached");
              });
            }, 30000)
            .then(function() {
              console.log("Extension loaded!");
              self.loadError = false;
              done();
            }, function(e) {
              console.log("Extension load timed out!", e);
              self.loadError = true;
              done();
            });
          });
        });
      });
    });

    it("should play", function(done) {
      driver.executeScript(helpers.eventScript("playPause")).then(function() {
        helpers.waitForLog(driver, {action: "playPause", count: 0}).then(function(result) {
          expect(result).to.be.true;
          done();
        });
      });
    });

    it("should pause", function(done) {
      driver.executeScript(helpers.eventScript("playPause")).then(function() {
        helpers.waitForLog(driver, {action: "playPause", count: 0}).then(function(result) {
          expect(result).to.be.true;
          done();
        });
      });
    });

    it("should play next", function(done) {
      driver.executeScript(helpers.eventScript("playNext")).then(function() {
        helpers.waitForLog(driver, {action: "playNext", count: 0}).then(function(result) {
          expect(result).to.be.true;
          done();
        });
      });
    });

    it("should play previous", function(done) {
      driver.executeScript(helpers.eventScript("playPrev")).then(function() {
        helpers.waitForLog(driver, {action: "playPrev", count: 0}).then(function(result) {
          expect(result).to.be.true;
          done();
        });
      });
    });

    it("should mute", function(done) {
      driver.executeScript(helpers.eventScript("mute")).then(function() {
        helpers.waitForLog(driver, {action: "mute", count: 0}).then(function(result) {
          expect(result).to.be.true;
          done();
        });
      });
    });

  });
};
