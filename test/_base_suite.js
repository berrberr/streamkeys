// Missing Tests:
// Amazon
// Pandora
// Seesu
// Spotify
// VK

var base = require("./_base_test.js"),
    driver = base.getDriver(),
    secrets = require("./secrets.json"),
    By = require("selenium-webdriver").By;

const TIMEOUT_ERROR = /Wait timed out after ([0-9]* ?)ms/;
const WAIT_TIMEOUT = 120000;

var baseSites = [
  {name: "7digital", url: "http://www.7digital.com"},
  {name: "bandcamp", url: "http://www.bandcamp.com"},
  {name: "bop.fm", url: "http://www.bop.fm"},
  {name: "di.fm", url: "http://www.di.fm/ambient"},
  {name: "edge player", url: "http://player.edge.ca"},
  {name: "grooveshark", url: "http://www.grooveshark.com"},
  {name: "hypemachine", url: "http://www.hypem.com"},
  {name: "myspace", url: "http://music.myspace.com"},
  {name: "mixcloud", url: "http://www.mixcloud.com"},
  {name: "pleer", url: "http://www.pleer.com"},
  {name: "radio paradise", url: "http://www.radioparadise.com"},
  {name: "slacker", url: "http://www.slacker.com"},
  // {name: "tunein", url: "http://www.tunein.com"},
  {name: "youarelisteningto", url: "http://www.youarelistening.to"}
];

describe("Streamkeys suite", function() {

  before(function(done) {
    // Wait for ABP to load
    driver.sleep(1000).then(function() {
      done();
    });
  });

  after(function() {
    driver.quit();
  });

  baseSites.forEach(function(site) {
    describe(site.name, function() {
      shared.shouldBehaveLikeAMusicSite(driver, site.url);
    });
  });

  // @depends: a.guest-login
  describe("stitcher", function() {
    before(function(done) {
      helpers.getAndWait(driver, "http://app.stitcher.com/");
      helpers.waitAndClick(driver, {css: "a.guest-login"});
      done();
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  // @depends: .stationbutton
  describe("last.fm", function() {
    before(function(done) {
      helpers.getAndWait(driver, "http://www.last.fm/listen");
      helpers.waitAndClick(driver, {className: "stationbutton"});
      done();
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  // @depends: img.concierge-situation-image, div.concierge-filter-play-icon
  describe("songza", function() {
    before(function(done) {
      helpers.getAndWait(driver, "http://songza.com/");
      helpers.waitAndClick(driver, {css: "img.concierge-situation-image"});
      helpers.waitAndClick(driver, {css: "div.concierge-filter-play-icon"});
      done();
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  // @depends: .playControls_wrapper
  describe("soundcloud", function() {
    before(function(done) {
      helpers.getAndWait(driver, "https://soundcloud.com/explore");
      helpers.waitForSelector(driver, {className: "playControls__wrapper"});
      done();
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  // @depends: #ready_link
  describe("thesixtyone", function() {
    before(function(done) {
      helpers.getAndWait(driver, "http://www.thesixtyone.com");
      helpers.waitAndClick(driver, {id: "ready_link"});
      done();
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  // @depends: a.yt-uix-tile-link
  describe("youtube", function() {
    before(function(done) {
      helpers.getAndWait(driver, "https://www.youtube.com");
      helpers.waitAndClick(driver, {css: "a.yt-uix-tile-link"});
      done();
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  // @depends: .station_anchor
  describe("jango", function() {
    before(function(done) {
      helpers.getAndWait(driver, "http://www.jango.com");
      driver.sleep(5000).then(function() {
        helpers.waitAndClick(driver, {className: "station_anchor"}, 30000);
        done();
      });
    });

    // Ad popup might mess up driver
    after(function(done) {
      driver.sleep(5000).then(function() {
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

    // Ad popup might mess up driver
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
      helpers.waitAndClick(driver, {css: "td.logo_on > img"});
      done();
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  // @depends: body.dragdrop-dropTarget
  describe("sony music unlimited", function() {
    before(function(done) {
      helpers.getAndWait(driver, "https://music.sonyentertainmentnetwork.com/");
      // Wait for body to contain class that is added when webapp has loaded
      helpers.waitForSelector(driver, {css: "body.dragdrop-dropTarget"});
      done();
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  // @depends: .top-channel, .audio-buttons
  describe("earbits", function() {
    before(function(done) {
      helpers.getAndWait(driver, "http://www.earbits.com");
      helpers.waitAndClick(driver, {className: "top-channel"});
      helpers.waitForSelector(driver, {className: "audio-buttons"});
      done();
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  // @depends: .login_btn, .login_mail, .login_password, .login_form_submit, .player-controls
  describe("deezer", function() {
    before(function(done) {
      helpers.getAndWait(driver, "http://www.deezer.com");
      helpers.waitAndClick(driver, {id: "login_btn"});
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
      helpers.waitAndClick(driver, {className: "genre-btn"});
      helpers.waitAndClick(driver, {className: "btn-primary"});
      helpers.waitForSelector(driver, {className: "player-controls"})
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
      helpers.waitForSelector(driver, {className: "player_bottom"});
      done();
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  // @depends: a.mix_name, a#play_overlay
  describe("8tracks", function() {
    before(function(done) {
      helpers.getAndWait(driver, "http://www.8tracks.com");
      helpers.waitAndClick(driver, {css: "a.mix_name"});
      helpers.waitAndClick(driver, {css: "a#play_overlay"});
      done();
    })

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });


  // @depends: #Email, #Passwd, #signIn, #player
  describe("googlemusic", function() {
    before(function(done) {
      helpers.getAndWait(driver, "http://music.google.com");
      driver.wait(function() {
        return (driver.isElementPresent({id: "Email"}) &&
                driver.isElementPresent({id: "Passwd"}));
      }, WAIT_TIMEOUT);
      driver.findElement({id: "Email"}).sendKeys(secrets.googlemusic.username);
      driver.findElement({id: "Passwd"}).sendKeys(secrets.googlemusic.password);
      helpers.waitAndClick(driver, {id: "signIn"});
      helpers.waitForSelector(driver, {id: "player"});
      done();
    });

    shared.shouldBehaveLikeAMusicSite(driver, false);
  });

  // // Strange bug here with webdriver messing up reading the console output
  // //@depends: #username, #password, [name=submit], .player_bottom, /account/signin/
  // describe("vk", function() {
  //   before(function(done) {
  //     helpers.getAndWait(driver, "http://www.vk.com").then(function() {
  //       driver.wait(function() {
  //         return (driver.isElementPresent({id: "quick_email"}) &&
  //                 driver.isElementPresent({id: "quick_pass"}) &&
  //                 driver.isElementPresent({id: "quick_login_button"}));
  //       }, WAIT_TIMEOUT);
  //       driver.findElement({id: "quick_email"}).sendKeys(secrets.vk.username);
  //       driver.findElement({id: "quick_pass"}).sendKeys(secrets.vk.password);
  //       driver.findElement({id: "quick_login_button"}).click();
  //       helpers.waitForSelector(driver, {id: "head_music"});
  //       done();
  //     });
  //   });

  //   shared.shouldBehaveLikeAMusicSite(driver, false);
  // });

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
