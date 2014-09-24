(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var controller = new BaseController();

controller.init({
  playPause: "#override"
});

controller.playPause = function() {
  var doc = document.querySelectorAll("iframe")[0].contentDocument;
  try {
    var playButton = doc.querySelector("#play_button");
    if(playButton.classList.contains("button_active")) {
      try {
        doc.querySelector("input[title='Stop Audio']").click();
        sk_log("playPause");
      } catch (e) {
        sk_log("Element not found for click.", e, true);
      }
    } else {
      try {
        playButton.click();
        sk_log("playPause");
      } catch (e) {
        sk_log("Element not found for click.", e, true);
      }
    }
  } catch (e) {
    sk_log("Element not found for click.", e, true);
  }
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbGV4L3N0cmVhbWtleXMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9hbGV4L3N0cmVhbWtleXMvY29kZS9qcy9jb250cm9sbGVycy9SYWRpb3BhcmFkaXNlQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY29udHJvbGxlciA9IG5ldyBCYXNlQ29udHJvbGxlcigpO1xuXG5jb250cm9sbGVyLmluaXQoe1xuICBwbGF5UGF1c2U6IFwiI292ZXJyaWRlXCJcbn0pO1xuXG5jb250cm9sbGVyLnBsYXlQYXVzZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZG9jID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlmcmFtZVwiKVswXS5jb250ZW50RG9jdW1lbnQ7XG4gIHRyeSB7XG4gICAgdmFyIHBsYXlCdXR0b24gPSBkb2MucXVlcnlTZWxlY3RvcihcIiNwbGF5X2J1dHRvblwiKTtcbiAgICBpZihwbGF5QnV0dG9uLmNsYXNzTGlzdC5jb250YWlucyhcImJ1dHRvbl9hY3RpdmVcIikpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRvYy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdGl0bGU9J1N0b3AgQXVkaW8nXVwiKS5jbGljaygpO1xuICAgICAgICBza19sb2coXCJwbGF5UGF1c2VcIik7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHNrX2xvZyhcIkVsZW1lbnQgbm90IGZvdW5kIGZvciBjbGljay5cIiwgZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHBsYXlCdXR0b24uY2xpY2soKTtcbiAgICAgICAgc2tfbG9nKFwicGxheVBhdXNlXCIpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBza19sb2coXCJFbGVtZW50IG5vdCBmb3VuZCBmb3IgY2xpY2suXCIsIGUsIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIHNrX2xvZyhcIkVsZW1lbnQgbm90IGZvdW5kIGZvciBjbGljay5cIiwgZSwgdHJ1ZSk7XG4gIH1cbn1cbiJdfQ==
