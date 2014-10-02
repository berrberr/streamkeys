exports.shouldBehaveLikeAMusicSite = function(driver, url) {

  describe("music site behaviour", function() {

    before(function() {
      // Extension not loaded error message
      this.skLoadError = new Error("Streamkeys not loaded!");

      // Has the page and extension loaded properly
      this.loadError = false;

      // Are we on the first test
      this.firstTest = true;
    });

    after(function() {
      driver.sleep(500);
    });

    /**
     * Check for a load error.
     * If found throw an error to exit out of describe block without running remaining tests.
     */
    beforeEach(function() {
      if(this.loadError && !this.firstTest) throw this.skLoadError;
    });

    it("should load", function(done) {
      var self = this;
      this.firstTest = false;

      if(url) {
        driver.get(url);
        // Attempt to close any active alerts if they exist
        helpers.alertCheck(driver);
      }

      // Wait for document to be ready
      // driver.wait(function() {
      //   console.log("Waiting for: " + url);
      //   return driver.executeScript("return document.readyState;").then(function(res) {
      //     return res === "complete";
      //   });
      // }, 15000)
      helpers.waitForLoad(driver).thenCatch(function(err) {
        console.log("Driver Timeout!", err);
        self.loadError = true;
      });

      // Wait for Streamkeys attached console message
      driver.wait(function() {
        return driver.manage().logs().get("browser").then(function(log) {
          return helpers.parseLog(log, "Attached");
        });
      }, 15000)
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

    it("should play", function(done) {
      driver.executeScript(helpers.eventScript("playPause")).then(function() {
        driver.manage().logs().get("browser").then(function(log) {
          expect(helpers.parseLog(log, "playPause")).to.be.true;
          done();
        });
      });
    });

    it("should pause", function(done) {
      driver.executeScript(helpers.eventScript("playPause")).then(function() {
        driver.manage().logs().get("browser").then(function(log) {
          expect(helpers.parseLog(log, "playPause")).to.be.true;
          done();
        });
      });
    });

    it("should play next", function(done) {
      driver.executeScript(helpers.eventScript("playNext")).then(function() {
        driver.manage().logs().get("browser").then(function(log) {
          expect(helpers.parseLog(log, "playNext")).to.be.true;
          done();
        });
      });
    });

    it("should play previous", function(done) {
      driver.executeScript(helpers.eventScript("playPrev")).then(function() {
        driver.manage().logs().get("browser").then(function(log) {
          expect(helpers.parseLog(log, "playPrev")).to.be.true;
          done();
        });
      });
    });

    it("should mute", function(done) {
      driver.executeScript(helpers.eventScript("mute")).then(function() {
        driver.manage().logs().get("browser").then(function(log) {
          expect(helpers.parseLog(log, "mute")).to.be.true;
          done();
        });
      });
    });

  });
};
