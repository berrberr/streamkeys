;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Podster",
    play: ".podster-play",
    pause: ".podster-pause",
    like: ".rait_up.like-button-up",
    dislike: ".rait_down.like-button-down",

    playState: ".podster-pause:not([style*=\"display: none\"])",

    song: ".podcast_content_top .title, div.user_playlist_block.podcast_playing .user_playlist_name a",
    artist: ".sidebar .sidebar_content .sidebar_title a, div.user_playlist_block.podcast_playing .user_playlist_podcast_name",
    art: ".sidebar .podcast_img_holder img, div.user_playlist_block.podcast_playing img",
    currentTime: "#podsterPlayer .podster-current-time",
    totalTime: "#podsterPlayer .podster-duration"
  });
})();
