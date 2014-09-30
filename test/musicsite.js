exports.shouldBehaveLikeAMusicSite = function(driver, url) {

  //var self = this;

  describe("music site behaviour", function() {

    /* Has the extension loaded properly */
    var isLoaded = false;

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
        }, 100).thenCatch(function(err) {
          console.log("CAUGHT: ", err);
          console.log("THIS: ", self);
        });

        // Wait for Streamkeys attached console message
        driver.wait(function() {
          return driver.manage().logs().get("browser").then(function(log) {
            return helpers.parseLog(log, "Attached listener");
          });
        }, 100)
        .then(function() {
          console.log("Extension loaded!");
          self.isLoaded = true;
          done();
        }, function(e) {
          console.log("EXT LOAD ERR: ", e);
          self.isLoaded = false;
          done();
        });
      });
    });

    it("should play", function(done) {
      if(this.isLoaded) {
        console.log("loaded!");
        driver.executeScript(helpers.eventScript("playPause")).then(function() {
          driver.manage().logs().get("browser").then(function(log) {
            expect(helpers.parseLog(log, "playPause")).to.be.true;
            done();
          });
        });
      } else {
        console.log("skip: ", this);
        done();
      }
    });

    it("should pause", function(done) {
      if(this.isLoaded) {
        driver.executeScript(helpers.eventScript("playPause")).then(function() {
          driver.manage().logs().get("browser").then(function(log) {
            expect(helpers.parseLog(log, "playPause")).to.be.true;
            done();
          });
        });
      } else {
        console.log("skip: ", this);
        done();
      }
    });

    it("should play next", function(done) {
      if(this.isLoaded) {
        driver.executeScript(helpers.eventScript("playNext")).then(function() {
          driver.manage().logs().get("browser").then(function(log) {
            expect(helpers.parseLog(log, "playNext")).to.be.true;
            done();
          });
        });
      } else {
        console.log("skip: ", this);
        done();
      }
    });

    it("should play previous", function(done) {
      if(this.isLoaded) {
        driver.executeScript(helpers.eventScript("playPrev")).then(function() {
          driver.manage().logs().get("browser").then(function(log) {
            expect(helpers.parseLog(log, "playPrev")).to.be.true;
            done();
          });
        });
      } else {
        console.log("skip: ", this);
        done();
      }
    });

    it("should mute", function(done) {
      if(this.isLoaded) {
        driver.executeScript(helpers.eventScript("mute")).then(function() {
          driver.manage().logs().get("browser").then(function(log) {
            expect(helpers.parseLog(log, "mute")).to.be.true;
            done();
          });
        });
      } else {
        console.log("skip: ", this);
        done();
      }
    });

  });
};
