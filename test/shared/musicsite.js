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
      var self = this;
      this.firstTest = false;

      if(url) {
        console.log("Override alerts and unloads");
        helpers.overrideAlerts(driver).then(function(val) {
          console.log("Override complete.");
          driver.get(url).then(function() {
            console.log("2 second sleep");
            driver.sleep(2000).then(function() {
              console.log("GOT: " + url + "...Checking alerts next...");
              // driver.getCurrentUrl().then(function(u) {
              //   console.log("current url: ", u);
              // });
              // Attempt to close any active alerts if they exist
              helpers.alertCheck(driver).then(function() {
                console.log("Alert check done");
                console.log("Starting waitforload");
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
        });
      } else {
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
      }
    });

    it("should play", function(done) {
      driver.executeScript(helpers.eventScript("playPause")).then(function() {
        //TODO: move this block from wait to a setTimeout function in helpers.
        var def = webdriver.promise.defer();
        driver.wait(function() {
          driver.manage().logs().get("browser").then(function(log) {
            console.log("log from inside: ", log);
            if(helpers.parseLog(log, "playPause")) def.fulfill(true);
          });
          return def.promise;
        }, 5000)
        .thenCatch(function(e) {
          console.log("ERR: ", e);
          done();
        })
        .then(function(res) {
          expect(res).to.be.true;
          done();
        });
      });
      // var self = this;
      // driver.executeScript(helpers.eventScript("playPause")).then(function() {
      //   console.log("have exec script, init sleep");
      //   driver.sleep(self.sleepAfterCommand).then(function() {
      //     console.log("sleep done");
      //     driver.manage().logs().get("browser").then(function(log) {
      //       console.log("log from insdie: ", log);
      //       expect(helpers.parseLog(log, "playPause")).to.be.true;
      //       done();
      //     });
      //   });
      // });
    });

    it("should pause", function(done) {
      var self = this;
      driver.executeScript(helpers.eventScript("playPause")).then(function() {
        driver.sleep(self.sleepAfterCommand).then(function() {
          driver.manage().logs().get("browser").then(function(log) {
            expect(helpers.parseLog(log, "playPause")).to.be.true;
            done();
          });
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
