document.onload = function() {
  document.dispatchEvent(new CustomEvent('streamkeys-installed', {'detail': chrome.runtime.getManifest().version}));
}