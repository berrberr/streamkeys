// Missing Tests:
// Amazon
// Deezer
// Earbits
// Google Music
// iHeartRadio
// Pandora
// Rdio
// Seesu
// Spotify
// VK
// YouTube

var base = require("./_base_test.js"),
    driver = base.getDriver(),
    secrets = require("./secrets.json"),
    By = require("selenium-webdriver").By;

const TIMEOUT_ERROR = /Wait timed out after ([0-9]* ?)ms/;


var baseSites = [
  // {name: "7digital", url: "http://www.7digital.com"},
  // {name: "bandcamp", url: "http://www.bandcamp.com"},
  // {name: "bop.fm", url: "http://www.bop.fm"},
  // {name: "di.fm", url: "http://www.di.fm"},
  // {name: "edge player", url: "http://player.edge.ca"},
  // {name: "grooveshar", url: "http://www.grooveshark.com"},
  // {name: "hypemachine", url: "http://www.hypem.fm"},
  // {name: "jango", url: "http://www.jango.com/stations/263448187/"},
  // {name: "last.fm", url: "http://www.last.fm"},
  // {name: "myspace", url: "http://music.myspace.com"},
  // {name: "mixcloud", url: "http://www.mixcloud.com"},
  // {name: "NPR one", url: "http://one.npr.org"},
  // {name: "pleer", url: "http://www.pleer.com"},
  // {name: "radio paradise", url: "http://www.radioparadise.com"},
  // {name: "soundcloud", url: "http://www.soundcloud.com"},
  // {name: "thesixtyone", url: "http://www.thesixtyone.com"},
  // {name: "tunein", url: "http://www.tunein.com"}
];

describe("Streamkeys suite", function() {

  before(function() {
    this.driver = driver;
  });

  after(function() {
    driver.quit();
  });

  baseSites.forEach(function(site) {
    describe(site.name, function() {
      shared.shouldBehaveLikeAMusicSite(driver, site.url);
    });
  });

  // describe("8tracks", function() {
  //   var self = this;

  //   before(function(done) {
  //     helpers.getAndWait(driver, "http://www.8tracks.com");
  //     driver.executeScript("document.querySelector('a.mix_name').click()").then(function() {
  //       console.log("Clicked mix link");
  //       helpers.waitForLoad(driver);
  //       driver.executeScript("document.querySelector('a#play_overlay').click()").then(function() {
  //         console.log("Clicked play link");
  //         done();
  //       });
  //     });
  //   })

  //   shared.shouldBehaveLikeAMusicSite(driver, false);
  // });

  // describe("songstr", function() {
  //   before(function(done) {
  //     helpers.getAndWait(driver, "http://songstr.com/#!/search/The-Smiths");
  //     driver.executeScript("document.querySelector('td.logo_on > img').click()").then(function() {
  //       console.log("clicked play");
  //       done();
  //     });
  //   });

  //   shared.shouldBehaveLikeAMusicSite(driver, false);
  // });

  describe("sony music unlimited", function() {
    before(function(done) {
      helpers.getAndWait(driver, "https://music.sonyentertainmentnetwork.com/");
      // Wait for body to contain class that is added when webapp has loaded
      driver.wait(function() {
        var el = driver.findElement({tagName: "body"});
        return el.getAttribute("class").then(function(classNames) {
          return (classNames.indexOf("dragdrop-dropTarget") > 0);
        });
      }, 10000)
      .then(function() {
        done();
      });
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  describe("deezer", function() {
    before(function(done) {
      helpers.getAndWait(driver, "http://www.deezer.com").then(function() {
        driver.findElement({id: "login_btn"}).click();
        driver.wait(function() {
          return (driver.isElementPresent({id: "login_mail"}) &&
                  driver.isElementPresent({id: "login_password"}) &&
                  driver.isElementPresent({id: "login_form_submit"}));
        }, 10000);
        driver.findElement({id: "login_mail"}).sendKeys(secrets.deezer.username);
        driver.findElement({id: "login_password"}).sendKeys(secrets.deezer.password);
        driver.findElement({id: "login_form_submit"}).click();
        driver.wait(function() {
          return (driver.isElementPresent({className: "player-controls"}));
        });

        done();
      });
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });
});
