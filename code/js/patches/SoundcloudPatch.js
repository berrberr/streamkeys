"use strict";
(function() {

  var patch = require("BaseCodePatcher");

  patch("/.*views-.*/g",
    "setup:function(){var e=this;this.listen",
    "setup:function(){var e=this;window.skAudio=this;this.listen");
})();
