;(function() {
    "use strict";

    var BaseController = require("BaseController");

    new BaseController({
      siteName: "Bilibili",
      play: "#bilibiliPlayer > div.bilibili-player-area.video-state-pause > div.bilibili-player-video-control > div.bilibili-player-video-btn.bilibili-player-video-btn-start.video-state-pause > i.bilibili-player-iconfont.bilibili-player-iconfont-start.icon-24play",
      pause: "#bilibiliPlayer > div.bilibili-player-area > div.bilibili-player-video-control > div.bilibili-player-video-btn.bilibili-player-video-btn-start > i.bilibili-player-iconfont.bilibili-player-iconfont-pause.icon-24pause",
      mute: "#bilibiliPlayer > div.bilibili-player-area.video-state-pause > div.bilibili-player-video-control > div.bilibili-player-video-btn.bilibili-player-video-btn-volume.video-state-volume-max > i.bilibili-player-iconfont.bilibili-player-iconfont-volume-max.icon-24soundlarge",

      playState: "#bilibiliPlayer > div.bilibili-player-area > div.bilibili-player-video-control > div.bilibili-player-video-btn.bilibili-player-video-btn-start > i.bilibili-player-iconfont.bilibili-player-iconfont-pause.icon-24pause",
      song: [
        "#app > div.bangumi-header.clearfix > div.header-info > h1",
        "#viewbox_report > div.info > div.v-title > h1",
        "#viewbox_report > h1",
      ],

      hidePlayer: true
    });
  })();
