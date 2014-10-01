exports.shouldBehaveLikeAMusicSite = function(driver, url) {

  describe("music site behaviour", function() {

    /* Has the page and extension loaded properly */
    var loadError = false;

    beforeEach(function() {
      if(this.loadError) this.test.error(new Error("Streamkeys not loaded!"));
    });

    it("should load", function(done) {
      var self = this;

      driver.get(url).then(function() {
        // Attempt to close any active alerts if they exist
        driver.switchTo().alert().then(function(alert) {
          alert.accept();
        }, function(error) {
          console.log("No alert found, continue...");
        });

        // Wait for document to be ready
        driver.wait(function() {
          console.log("Waiting for: " + url);
          return driver.executeScript("return document.readyState;").then(function(res) {
            return res === "complete";
          });
        }, 10).thenCatch(function(err) {
          console.log("Driver Timeout!", err);
          self.loadError = true;
        });

        // Wait for Streamkeys attached console message
        driver.wait(function() {
          return driver.manage().logs().get("browser").then(function(log) {
            return helpers.parseLog(log, "Attached listener");
          });
        }, 10)
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
