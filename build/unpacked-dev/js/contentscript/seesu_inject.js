(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {

  document.addEventListener('streamkeys-cmd', function(e) {
    //Get seesu current song object (thanks Gleb!)
    var song = window.su.p && window.su.p.c_song;
    if(song) {
      if(e.detail === 'playPause') {
        if(song.states.play) {
          try {
            song.pause();
            sk_log("playPause");
          } catch (e) {
            sk_log("playPause", {}, true);
          }
        } else {
          try {
            song.play();
            sk_log("playPause");
          } catch (e) {
            sk_log("playPause", {}, true);
          }
        }
      } else if(e.detail === 'next') {
        try {
          song.playNext();
          sk_log("playNext");
        } catch (e) {
          sk_log("playNext", {}, true);
        }
      } else if(e.detail === 'prev') {
        try{
          song.playPrev();
          sk_log("playPrev"); 
        } catch (e) {
          sk_log("playPrev", {}, true);
        }
      }
    }
  });

})();
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbGV4L3N0cmVhbWtleXMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9hbGV4L3N0cmVhbWtleXMvY29kZS9qcy9jb250ZW50c2NyaXB0L3NlZXN1X2luamVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCkge1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3N0cmVhbWtleXMtY21kJywgZnVuY3Rpb24oZSkge1xuICAgIC8vR2V0IHNlZXN1IGN1cnJlbnQgc29uZyBvYmplY3QgKHRoYW5rcyBHbGViISlcbiAgICB2YXIgc29uZyA9IHdpbmRvdy5zdS5wICYmIHdpbmRvdy5zdS5wLmNfc29uZztcbiAgICBpZihzb25nKSB7XG4gICAgICBpZihlLmRldGFpbCA9PT0gJ3BsYXlQYXVzZScpIHtcbiAgICAgICAgaWYoc29uZy5zdGF0ZXMucGxheSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzb25nLnBhdXNlKCk7XG4gICAgICAgICAgICBza19sb2coXCJwbGF5UGF1c2VcIik7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgc2tfbG9nKFwicGxheVBhdXNlXCIsIHt9LCB0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNvbmcucGxheSgpO1xuICAgICAgICAgICAgc2tfbG9nKFwicGxheVBhdXNlXCIpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHNrX2xvZyhcInBsYXlQYXVzZVwiLCB7fSwgdHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYoZS5kZXRhaWwgPT09ICduZXh0Jykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHNvbmcucGxheU5leHQoKTtcbiAgICAgICAgICBza19sb2coXCJwbGF5TmV4dFwiKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHNrX2xvZyhcInBsYXlOZXh0XCIsIHt9LCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmKGUuZGV0YWlsID09PSAncHJldicpIHtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgIHNvbmcucGxheVByZXYoKTtcbiAgICAgICAgICBza19sb2coXCJwbGF5UHJldlwiKTsgXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBza19sb2coXCJwbGF5UHJldlwiLCB7fSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG59KSgpOyJdfQ==
