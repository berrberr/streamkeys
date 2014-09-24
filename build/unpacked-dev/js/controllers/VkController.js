(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var controller = new BaseController();
controller.selector_controlbox = "#head_music";

controller.init({
  playPause: "#head_play_btn",
  playNext: ".next.ctrl",
  playPrev: ".prev.ctrl"
});

//Must have control box open to click the next/prev controls
controller.playNext = function() {
  this.click(this.selector_controlbox);
  this.click(this.selector_playNext);
  this.click(this.selector_controlbox);
};
controller.playPrev = function() {
  this.click(this.selector_controlbox);
  this.click(this.selector_playPrev);
  this.click(this.selector_controlbox);
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbGV4L3N0cmVhbWtleXMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9hbGV4L3N0cmVhbWtleXMvY29kZS9qcy9jb250cm9sbGVycy9Wa0NvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGNvbnRyb2xsZXIgPSBuZXcgQmFzZUNvbnRyb2xsZXIoKTtcbmNvbnRyb2xsZXIuc2VsZWN0b3JfY29udHJvbGJveCA9IFwiI2hlYWRfbXVzaWNcIjtcblxuY29udHJvbGxlci5pbml0KHtcbiAgcGxheVBhdXNlOiBcIiNoZWFkX3BsYXlfYnRuXCIsXG4gIHBsYXlOZXh0OiBcIi5uZXh0LmN0cmxcIixcbiAgcGxheVByZXY6IFwiLnByZXYuY3RybFwiXG59KTtcblxuLy9NdXN0IGhhdmUgY29udHJvbCBib3ggb3BlbiB0byBjbGljayB0aGUgbmV4dC9wcmV2IGNvbnRyb2xzXG5jb250cm9sbGVyLnBsYXlOZXh0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuY2xpY2sodGhpcy5zZWxlY3Rvcl9jb250cm9sYm94KTtcbiAgdGhpcy5jbGljayh0aGlzLnNlbGVjdG9yX3BsYXlOZXh0KTtcbiAgdGhpcy5jbGljayh0aGlzLnNlbGVjdG9yX2NvbnRyb2xib3gpO1xufTtcbmNvbnRyb2xsZXIucGxheVByZXYgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5jbGljayh0aGlzLnNlbGVjdG9yX2NvbnRyb2xib3gpO1xuICB0aGlzLmNsaWNrKHRoaXMuc2VsZWN0b3JfcGxheVByZXYpO1xuICB0aGlzLmNsaWNrKHRoaXMuc2VsZWN0b3JfY29udHJvbGJveCk7XG59O1xuIl19
