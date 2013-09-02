var s = document.createElement('script');
s.src = chrome.extension.getURL('gs_methods.js');
(document.head||document.documentElement).appendChild(s);
s.onload = function() {
    s.parentNode.removeChild(s);
};