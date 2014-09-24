(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var controller = new BaseController();

controller.init({
  playPause: "#override",
  playNext: "#override",
  playPrev: "#override"
});

controller.playPause = function() {
  document.dispatchEvent(new CustomEvent("streamkeys-cmd", {"detail": "playPause"}));
}
controller.playNext = function() {
  document.dispatchEvent(new CustomEvent("streamkeys-cmd", {"detail": "next"}));
}
controller.playPrev = function() {
  document.dispatchEvent(new CustomEvent("streamkeys-cmd", {"detail": "prev"}));
}

controller.injectScript({url: "/contentscript/seesu_inject.js"});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbGV4L3N0cmVhbWtleXMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9hbGV4L3N0cmVhbWtleXMvY29kZS9qcy9jb250cm9sbGVycy9TZWVzdUNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBjb250cm9sbGVyID0gbmV3IEJhc2VDb250cm9sbGVyKCk7XG5cbmNvbnRyb2xsZXIuaW5pdCh7XG4gIHBsYXlQYXVzZTogXCIjb3ZlcnJpZGVcIixcbiAgcGxheU5leHQ6IFwiI292ZXJyaWRlXCIsXG4gIHBsYXlQcmV2OiBcIiNvdmVycmlkZVwiXG59KTtcblxuY29udHJvbGxlci5wbGF5UGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJzdHJlYW1rZXlzLWNtZFwiLCB7XCJkZXRhaWxcIjogXCJwbGF5UGF1c2VcIn0pKTtcbn1cbmNvbnRyb2xsZXIucGxheU5leHQgPSBmdW5jdGlvbigpIHtcbiAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJzdHJlYW1rZXlzLWNtZFwiLCB7XCJkZXRhaWxcIjogXCJuZXh0XCJ9KSk7XG59XG5jb250cm9sbGVyLnBsYXlQcmV2ID0gZnVuY3Rpb24oKSB7XG4gIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwic3RyZWFta2V5cy1jbWRcIiwge1wiZGV0YWlsXCI6IFwicHJldlwifSkpO1xufVxuXG5jb250cm9sbGVyLmluamVjdFNjcmlwdCh7dXJsOiBcIi9jb250ZW50c2NyaXB0L3NlZXN1X2luamVjdC5qc1wifSk7XG4iXX0=
