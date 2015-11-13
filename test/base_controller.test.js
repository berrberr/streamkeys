var BaseController = require("../code/js/modules/BaseController.js"),
    $ = require("jquery");

jasmine.getFixtures().fixturesPath = "base/test/fixtures";

describe("base controller", function() {
  describe("basic music site", function() {
    beforeAll(function() {
      jasmine.getFixtures().load("music_site.html");
      BaseController.init({
        siteName: "Basic Music Site",
        play: "#play",
        pause: "#pause",
        playNext: "#play-next",
        playPrev: "#play-prev",
        mute: "#volume",
        like: "#like",
        dislike: "#dislike",

        playState: "#player-container.playing",
        song: "#song-title",
        artist: "#artist-title"
      })
    });

    // jasmine.getFixtures().load("music_site.html");
    // console.log("music site: ", jasmine.getFixtures());
    // expect($("#player-container")).toExist()
  });
});
