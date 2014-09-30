exports.shouldBehaveLikeAMusicSite = function(driver, url) {

  describe("music site behaviour", function() {

    // after(function() {
    //   driver.quit();
    // });

    before(function() {
      console.log("BEFORE: " + url);
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
        }, 20000)
        .then(function() {
          // Wait for Streamkeys attached console message
          driver.wait(function() {
            return driver.manage().logs().get("browser").then(function(log) {
              return helpers.parseLog(log, "Attached listener");
            });
          }, 20000).then(function() {console.log("Extension loaded!");});
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
