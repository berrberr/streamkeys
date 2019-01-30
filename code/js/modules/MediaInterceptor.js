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
        window.skMedias.push(element);
      }
      if(args.length > 0 && args[0] == "audio") {
        window.skMedias.push(element);
      }
      return element;
    };
  }`;
  var script = document.createElement("script");
  script.textContent = code;
  (document.head||document.documentElement).appendChild(script);
  script.remove();
})();
