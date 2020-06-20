"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "163",
    playPause: "#g_player > div.btns > a.ply.j-flag",
    playNext: "#g_player > div.btns > a.nxt",
    playPrev: "#g_player > div.btns > a.prv",
    song: "#g_player > div.play > div.j-flag.words > a.f-thide.name.fc1.f-fl",
    artist: "#g_player > div.play > div.j-flag.words > span > span > a"
  });
})();
