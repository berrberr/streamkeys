"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "StreamElements",
    playPause: "#dashboard > div > div.songrequest-wrap.layout-row.layout-align-center-start.layout-sm-column.layout-xs-column.ng-scope > md-card.layout-column.layout-align-center-center.element-100pw.songrequest-current-song.flex._md > md-content > div.controls.layout-row.layout-align-start-center.element-100pw > div.layout-row.layout-align-center-center.actions > button:nth-child(1)",
    playNext: "#dashboard > div > div.songrequest-wrap.layout-row.layout-align-center-start.layout-sm-column.layout-xs-column.ng-scope > md-card.layout-column.layout-align-center-center.element-100pw.songrequest-current-song.flex._md > md-content > div.controls.layout-row.layout-align-start-center.element-100pw > div.layout-row.layout-align-center-center.actions > button:nth-child(2)",
    song: "#dashboard > div > div.songrequest-wrap.layout-row.layout-align-center-start.layout-sm-column.layout-xs-column.ng-scope > md-card.layout-column.layout-align-center-center.element-100pw.songrequest-current-song.flex._md > md-content > div.info.element-100pw > h1",
    iframe: ".video"
  });
})();
