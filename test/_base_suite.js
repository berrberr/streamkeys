// Missing Tests:
// Amazon
// Google Music
// Pandora
// Seesu
// Spotify
// YouTube

var base = require("./_base_test.js"),
    driver = base.getDriver(),
    secrets = require("./secrets.json"),
    By = require("selenium-webdriver").By;

const TIMEOUT_ERROR = /Wait timed out after ([0-9]* ?)ms/;
const WAIT_TIMEOUT = 20000;


var baseSites = [
  {name: "7digital", url: "http://www.7digital.com"},
  {name: "bandcamp", url: "http://www.bandcamp.com"},
  {name: "bop.fm", url: "http://www.bop.fm"},
  {name: "di.fm", url: "http://www.di.fm/ambient"},
  {name: "edge player", url: "http://player.edge.ca"},
  {name: "grooveshar", url: "http://www.grooveshark.com"},
  {name: "hypemachine", url: "http://www.hypem.com"},
  {name: "last.fm", url: "http://www.last.fm/listen"},
  {name: "myspace", url: "http://music.myspace.com"},
  {name: "mixcloud", url: "http://www.mixcloud.com"},
  {name: "pleer", url: "http://www.pleer.com"},
  {name: "radio paradise", url: "http://www.radioparadise.com"},
  {name: "soundcloud", url: "https://soundcloud.com/explore"},
  {name: "thesixtyone", url: "http://www.thesixtyone.com"},
  {name: "tunein", url: "http://www.tunein.com"}
];

describe("Streamkeys suite", function() {

  before(function() {
    this.driver = driver;
  });

  after(function() {
    driver.quit();
  });

  // baseSites.forEach(function(site) {
  //   describe(site.name, function() {
  //     shared.shouldBehaveLikeAMusicSite(driver, site.url);
  //   });
  // });

  // @depends: a.mix_name, a#play_overlay
  describe("8tracks", function() {
    before(function(done) {
      helpers.getAndWait(driver, "http://www.8tracks.com");
      driver.executeScript("document.querySelector('a.mix_name').click()").then(function() {
        helpers.waitForLoad(driver);
        driver.wait(function() {
          return (driver.isElementPresent({css: "a#play_overlay"}));
        }, WAIT_TIMEOUT);
        driver.findElement({css: "a#play_overlay"}).click().then(function() {
          done();
        });
      });
    })

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  // @depends: .station_anchor
  describe("jango", function() {
    before(function(done) {
      helpers.getAndWait(driver, "http://www.jango.com");
      driver.findElement({className: "station_anchor"}).click().then(function() {
        done();
      });
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  describe("NPR one", function() {
    before(function(done) {
      helpers.getAndWait(driver, "http://one.npr.org");
      done();
    });

    after(function(done) {
      driver.sleep(5000).then(function() {
        done();
      });
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  // @depends: td.logo_on, /search/
  describe("songstr", function() {
    before(function(done) {
      helpers.getAndWait(driver, "http://songstr.com/#!/search/The-Smiths");
      driver.executeScript("document.querySelector('td.logo_on > img').click()").then(function() {
        console.log("clicked play");
        done();
      });
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  // @depends: body.dragdrop-dropTarget
  describe("sony music unlimited", function() {
    before(function(done) {
      helpers.getAndWait(driver, "https://music.sonyentertainmentnetwork.com/");
      // Wait for body to contain class that is added when webapp has loaded
      driver.wait(function() {
        var el = driver.findElement({tagName: "body"});
        return el.getAttribute("class").then(function(classNames) {
          return (classNames.indexOf("dragdrop-dropTarget") > 0);
        });
      }, WAIT_TIMEOUT)
      .then(function() {
        done();
      });
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  // @depends: .top-channel, .audio-buttons
  describe("earbits", function() {
    before(function(done) {
      helpers.getAndWait(driver, "http://www.earbits.com");
      driver.wait(function() {
        return (driver.isElementPresent({className: "top-channel"}));
      }, WAIT_TIMEOUT);
      driver.findElement({className: "top-channel"}).click();
      driver.wait(function() {
        return (driver.isElementPresent({className: "audio-buttons"}));
      });
      done();
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  // @depends: .login_btn, .login_mail, .login_password, .login_form_submit, .player-controls
  describe("deezer", function() {
    before(function(done) {
      helpers.getAndWait(driver, "http://www.deezer.com");
      driver.findElement({id: "login_btn"}).click();
      driver.wait(function() {
        return (driver.isElementPresent({id: "login_mail"}) &&
                driver.isElementPresent({id: "login_password"}) &&
                driver.isElementPresent({id: "login_form_submit"}));
      }, WAIT_TIMEOUT);
      driver.findElement({id: "login_mail"}).sendKeys(secrets.deezer.username);
      driver.findElement({id: "login_password"}).sendKeys(secrets.deezer.password);
      driver.findElement({id: "login_form_submit"}).click();
      driver.wait(function() {
        return (driver.isElementPresent({className: "player-controls"}));
      }, WAIT_TIMEOUT);

      done();
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  // @depends: .genre-btn, .btn-primary, .player-controls, [@data-station-id]
  describe("iHeartRadio", function() {
    before(function(done) {
      helpers.getAndWait(driver, "http://www.iheart.com");
      driver.findElement({className: "genre-btn"}).click();
      driver.findElement({className: "btn-primary"}).click();
      driver.wait(function() {
        var playerEl = driver.findElement({className: "player-controls"});
        return playerEl.getAttribute("data-station-id").then(function(val) {
          return val !== null;
        })
      }, WAIT_TIMEOUT);
      done();
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  // @depends: #username, #password, [name=submit], .player_bottom, /account/signin/
  describe("rdio", function() {
    before(function(done) {
      helpers.getAndWait(driver, "https://www.rdio.com/account/signin/");
      driver.wait(function() {
        return (driver.isElementPresent({id: "username"}) &&
                driver.isElementPresent({id: "password"}) &&
                driver.isElementPresent({name: "submit"}));
      }, WAIT_TIMEOUT);
      driver.findElement({id: "username"}).sendKeys(secrets.rdio.username);
      driver.findElement({id: "password"}).sendKeys(secrets.rdio.password);
      driver.findElement({name: "submit"}).click();
      driver.wait(function() {
        return (driver.isElementPresent({className: "player_bottom"}));
      }, WAIT_TIMEOUT);
      done();
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  //@depends: #username, #password, [name=submit], .player_bottom, /account/signin/
  describe("vk", function() {
    before(function(done) {
      helpers.getAndWait(driver, "http://www.vk.com");
      driver.wait(function() {
        return (driver.isElementPresent({id: "quick_email"}) &&
                driver.isElementPresent({id: "quick_pass"}) &&
                driver.isElementPresent({id: "quick_login_button"}));
      }, WAIT_TIMEOUT);
      driver.findElement({id: "quick_email"}).sendKeys(secrets.vk.username);
      driver.findElement({id: "quick_pass"}).sendKeys(secrets.vk.password);
      driver.findElement({id: "quick_login_button"}).click();
      driver.wait(function() {
        return (driver.isElementPresent({id: "head_music"}));
      }, WAIT_TIMEOUT);
      done();
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  // // Iframes are too anoying
  // describe("spotify", function() {
  //   before(function(done) {
  //     helpers.getAndWait(driver, "https://play.spotify.com/");
  //     driver.findElement({id: "has-account"}).click();
  //     driver.wait(function() {
  //       return (driver.isElementPresent({id: "login-usr"}) &&
  //               driver.isElementPresent({id: "login-pass"}) &&
  //               driver.isElementPresent({css: "button[type=submit]"}));
  //     }, WAIT_TIMEOUT);
  //     driver.findElement({id: "login-usr"}).sendKeys(secrets.spotify.username);
  //     driver.findElement({id: "login-pass"}).sendKeys(secrets.spotify.password);
  //     driver.findElement({css: "button[type=submit]"}).click();
  //     driver.wait(function() {
  //       return (driver.isElementPresent({css: ".root > iframe"}));
  //     }, WAIT_TIMEOUT);
  //     driver.switchTo().frame(driver.findElement({css: ".root > iframe"})).then(function() {
  //       driver.wait(function() {
  //         console.log("wait for playback");
  //         return (driver.isElementPresent({className: "media-object-playlist"}));
  //       }, WAIT_TIMEOUT)
  //       .then(function() {
  //         driver.sleep(1000).then(function() {
  //           driver.findElement({className: "media-object-playlist"}).click().then(function() {
  //             console.log("clicked it");
  //             driver.wait(function() {
  //               return (driver.isElementPresent({className: "btn-play-text"}));
  //             });
  //             driver.findElement({className: "btn-play-text"}).click().then(function() {
  //               driver.switchTo().defaultContent().then(function() {
  //                 driver.sleep(2000).then(function(){done();});
  //               });
  //             })
  //           });
  //         });
  //       });
  //     });
  //   });

  //   shared.shouldBehaveLikeAMusicSite(driver, false);
  // });
});
