(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function() {
  "use strict";

  module.exports = function(msg, obj, err) {
    obj = obj || "";
    if(err) { console.error("STREAMKEYS-ERROR: " + msg, obj); }
    else { console.log("STREAMKEYS-INFO: " + msg, obj); }
  };
})();

},{}],2:[function(require,module,exports){
(function() {
  "use strict";

  var sk_log = require("./modules/sk_log.js");
  document.addEventListener("streamkeys-cmd", function(e) {
    //Get seesu current song object (thanks Gleb!)
    var song = window.su.p && window.su.p.c_song;
    if(song) {
      if(e.detail === "playPause") {
        if(song.states.play) {
          try {
            song.pause();
            sk_log("playPause");
          } catch (exception) {
            sk_log("playPause", exception, true);
          }
        } else {
          try {
            song.play();
            sk_log("playPause");
          } catch (exception) {
            sk_log("playPause", exception, true);
          }
        }
      } else if(e.detail === "next") {
        try {
          song.playNext();
          sk_log("playNext");
        } catch (exception) {
          sk_log("playNext", exception, true);
        }
      } else if(e.detail === "prev") {
        try {
          song.playPrev();
          sk_log("playPrev");
        } catch (exception) {
          sk_log("playPrev", exception, true);
        }
      }
    }
  });

})();

},{"./modules/sk_log.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbGV4Zy9Eb2N1bWVudHMvc2NyaXB0cy9zdHJlYW1rZXlzL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWxleGcvRG9jdW1lbnRzL3NjcmlwdHMvc3RyZWFta2V5cy9jb2RlL2pzL21vZHVsZXMvc2tfbG9nLmpzIiwiL1VzZXJzL2FsZXhnL0RvY3VtZW50cy9zY3JpcHRzL3N0cmVhbWtleXMvY29kZS9qcy9zZWVzdV9pbmplY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIjsoZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obXNnLCBvYmosIGVycikge1xuICAgIG9iaiA9IG9iaiB8fCBcIlwiO1xuICAgIGlmKGVycikgeyBjb25zb2xlLmVycm9yKFwiU1RSRUFNS0VZUy1FUlJPUjogXCIgKyBtc2csIG9iaik7IH1cbiAgICBlbHNlIHsgY29uc29sZS5sb2coXCJTVFJFQU1LRVlTLUlORk86IFwiICsgbXNnLCBvYmopOyB9XG4gIH07XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgc2tfbG9nID0gcmVxdWlyZShcIi4vbW9kdWxlcy9za19sb2cuanNcIik7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzdHJlYW1rZXlzLWNtZFwiLCBmdW5jdGlvbihlKSB7XG4gICAgLy9HZXQgc2Vlc3UgY3VycmVudCBzb25nIG9iamVjdCAodGhhbmtzIEdsZWIhKVxuICAgIHZhciBzb25nID0gd2luZG93LnN1LnAgJiYgd2luZG93LnN1LnAuY19zb25nO1xuICAgIGlmKHNvbmcpIHtcbiAgICAgIGlmKGUuZGV0YWlsID09PSBcInBsYXlQYXVzZVwiKSB7XG4gICAgICAgIGlmKHNvbmcuc3RhdGVzLnBsYXkpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgc29uZy5wYXVzZSgpO1xuICAgICAgICAgICAgc2tfbG9nKFwicGxheVBhdXNlXCIpO1xuICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgc2tfbG9nKFwicGxheVBhdXNlXCIsIGV4Y2VwdGlvbiwgdHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzb25nLnBsYXkoKTtcbiAgICAgICAgICAgIHNrX2xvZyhcInBsYXlQYXVzZVwiKTtcbiAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgIHNrX2xvZyhcInBsYXlQYXVzZVwiLCBleGNlcHRpb24sIHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmKGUuZGV0YWlsID09PSBcIm5leHRcIikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHNvbmcucGxheU5leHQoKTtcbiAgICAgICAgICBza19sb2coXCJwbGF5TmV4dFwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgc2tfbG9nKFwicGxheU5leHRcIiwgZXhjZXB0aW9uLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmKGUuZGV0YWlsID09PSBcInByZXZcIikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHNvbmcucGxheVByZXYoKTtcbiAgICAgICAgICBza19sb2coXCJwbGF5UHJldlwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgc2tfbG9nKFwicGxheVByZXZcIiwgZXhjZXB0aW9uLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbn0pKCk7XG4iXX0=
