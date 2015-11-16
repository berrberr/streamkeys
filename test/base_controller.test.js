var BaseController = require("../code/js/modules/BaseController.js"),
    $ = require("jquery");

jasmine.getFixtures().fixturesPath = "base/test/fixtures";

describe("base controller", function() {
  var controller;

  describe("basic music site", function() {

    beforeAll(function() {
      controller = new BaseController({
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
      });
    });

    beforeEach(function() {
      loadFixtures("basic_music_site.html");
    });

    it("gets proper state data on init", function() {
      var stateData = controller.getStateData();

      expect(stateData.canPlayPause).toBe(true);
      expect(stateData.canPlayPrev).toBe(true);
      expect(stateData.canPlayNext).toBe(true);
      expect(stateData.canLike).toBe(true);
      expect(stateData.canDislike).toBe(true);
      expect(stateData.isPlaying).toBeFalsy();
      expect(stateData.hidePlayer).toBe(false);
      expect(stateData.siteName).toBe("Basic Music Site");
      expect(stateData.song).toBe("Song");
      expect(stateData.artist).toBe("Artist");
    });

    it("plays and pauses and updates player state", function() {
      controller.playPause();
      expect(controller.getStateData().isPlaying).toBe(true);
      sinon.assert.calledWithMatch(chrome.runtime.sendMessage, { action: "update_player_state" });
      controller.playPause();
      expect(controller.getStateData().isPlaying).toBe(false);
      sinon.assert.calledWithMatch(chrome.runtime.sendMessage, { action: "update_player_state" });
    });

    it("plays next and updates player state", function() {
      controller.playNext();
      expect(controller.getStateData().song).toBe("NextSongToggled");
      sinon.assert.calledWithMatch(chrome.runtime.sendMessage, { action: "update_player_state" });
    });

    it("plays prev and updates player state", function() {
      controller.playPrev();
      expect(controller.getStateData().song).toBe("PrevSongToggled");
      sinon.assert.calledWithMatch(chrome.runtime.sendMessage, { action: "update_player_state" });
    });

    it("mutes", function() {
      controller.mute();
      expect($("#volume")).toHaveText("MuteToggled");
    });

    it("likes", function() {
      controller.like();
      expect($("#like")).toHaveText("LikeToggled");
    });

    it("dislikes", function() {
      controller.dislike();
      expect($("#dislike")).toHaveText("DislikeToggled");
    });
  });

  describe("music site with hideplayer", function() {
    it("sets hidePlayer", function() {
      controller = new BaseController({
        siteName: "Hideplayer Music Site",
        hidePlayer: true
      });
      expect(controller.getStateData().hidePlayer).toBe(true);
    });
  });

  describe("music site with iframe", function() {
    beforeAll(function() {
      controller = new BaseController({
        siteName: "Music Site With iFrame",
        play: "#play",
        pause: "#pause",
        playNext: "#play-next",
        iframe: "#player-frame",

        playState: "#play.playing",
        song: "#song-title"
      });
    });

    // We have to add a small delay here to account for iframe#ready event to fire
    beforeEach(function(done) {
      loadFixtures("music_site_with_iframe.html");
      setTimeout(function() {
        done();
      }, 100);
    });

    it("gets proper state data on init", function() {
      var stateData = controller.getStateData();

      expect(stateData.canPlayPause).toBe(true);
      expect(stateData.canPlayNext).toBe(true);
      expect(stateData.canPlayPrev).toBe(false);
      expect(stateData.canLike).toBe(false);
      expect(stateData.canDislike).toBe(false);
      expect(stateData.isPlaying).toBeFalsy();
      expect(stateData.song).toBe("IFRAME SONG");
    });

    it("plays and pauses and updates player state", function() {
      controller.playPause();
      console.log(controller.getStateData());
      expect(controller.getStateData().isPlaying).toBe(true);
      sinon.assert.calledWithMatch(chrome.runtime.sendMessage, { action: "update_player_state" });
      controller.playPause();
      expect(controller.getStateData().isPlaying).toBe(false);
      sinon.assert.calledWithMatch(chrome.runtime.sendMessage, { action: "update_player_state" });
    });
  });

  describe("music site with buttonSwitch", function() {

  });

  describe("music site with playPause button", function() {

  });

  describe("music site with play and pause hidden buttons", function() {

  });
});
