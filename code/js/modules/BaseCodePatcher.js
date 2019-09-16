;(function() {
  "use strict";
  // modifies all javascript file that matches urlpattern
  // in each ja file searchvalue is replaced by newvalue
  // this doesn't:
  // - modify the url/domain of the original js code
  // - add any evil code that tracks user actions or send private data to a malicious server,
  //   to verify this, find references of this functions, e.g. `git grep -i patch(`
  //   in the project root directory
  function patch(urlpattern, searchvalue, newvalue) {
    var code = `
    var callback = function(mutationsList) {
      for(var mutation of mutationsList) {
        if (mutation.type == "childList") {
          if (mutation.addedNodes.length == 0) {
              return;
          }
          var node = mutation.addedNodes[0];
          if (node.nodeName == "SCRIPT") {
            var pattern = ${urlpattern};
            if (pattern.test(node.src)) {
              var url = node.src;
              node.removeAttribute("src");
              node.textContent =
              \`(function() {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                  if (this.readyState == 4 && this.status == 200) {
                    var js = xhttp.responseText;
                    js = js.replace("${searchvalue}",
                                    "${newvalue}");
                    console.log("patching \$\{url\}")
                    var script = document.createElement("script");
                    script.textContent = js;
                    if (document.currentScript.parentElement.lastElementChild == document.currentScript) {
                      // append to end
                      document.currentScript.parentElement.appendChild(script);
                    } else {
                      document.currentScript.parentElement.insertBefore(script, document.currentScript.nextElementSibling);
                    }
                  }
                };
                xhttp.open("GET", "\$\{url\}", false);
                xhttp.send();
              })();
              //# sourceURL=patch.js;\`;
            }
          }
        }
      }
    };

    var observer = new MutationObserver(callback);
    observer.observe(document.documentElement, { childList: true, subtree: true });`;
    var script = document.createElement("script");
    script.textContent = code;
    (document.head||document.documentElement).appendChild(script);
    script.remove();
  }
  module.exports = patch;
})();
