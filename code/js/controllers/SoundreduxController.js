"use strict";
(function() {
  var BaseController = require("BaseController");

  var playerMain = ".player-main";
  var playerInfo = ".player-info";

  var titleInfo = ".song-card-details > .song-card-title";
  var artistInfo = ".song-card-details > .song-card-user-username";

  var playerButtons = ".player-section:nth-child(2)";
  var playState = ".ion-ios-pause";
  var prevButton = ".player-button:nth-child(1)";
  var playButton = ".player-button:nth-child(2)";
  var nextButton = ".player-button:nth-child(3)";

  var playerControls = ".player-section:nth-child(4)";
  var muteControl = ".player-volume-button";

  new BaseController({
    siteName: "SoundRedux",
    like: ".song-card.active .song-card-heart",

    song: ([ playerMain, playerInfo, titleInfo ].join(" > ")),
    artist: ([ playerMain, playerInfo, artistInfo ].join(" > ")),
    playPrev: ([ playerMain, playerButtons, prevButton ].join(" > ")),
    playPause: ([ playerMain, playerButtons, playButton ].join(" > ")),
    playNext: ([ playerMain, playerButtons, nextButton ].join(" > ")),
    playState: ([ playerMain, playerButtons, playButton, playState ].join(" > ")),

    mute: ([ playerMain, playerControls, muteControl ].join(" > ")),

    hidePlayer: true
  });
})();
