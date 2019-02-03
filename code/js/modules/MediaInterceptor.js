(function() {
  "use strict";
  var code = `
  if (window.skOldCreateElement == undefined) {
    console.log("adding media interceptor");
    window.skOldCreateElement = document.createElement;
    window.skMedias = [];
    document.createElement = function(...args) {
      var element = window.skOldCreateElement.apply(document, args);
      if(args.length > 0 && args[0] == "video") {
        document.querySelector("#skMedias").append(element);
        window.skMedias.push(element);
      }
      if(args.length > 0 && args[0] == "audio") {
        document.querySelector("#skMedias").append(element);
        window.skMedias.push(element);
      }
      return element;
    };
  }`;
  var mediaContainer = document.createElement("div");
  mediaContainer.id = "skMedias";
  (document.head||document.documentElement).appendChild(mediaContainer);
  var script = document.createElement("script");
  script.textContent = code;
  (document.head||document.documentElement).appendChild(script);
  script.remove();
})();
