# Streamkeys v1.4.0 [![Build Status](https://travis-ci.org/berrberr/streamkeys.svg?branch=master)](https://travis-ci.org/berrberr/streamkeys)

Chrome extension to send "global" (ie. across the browser) hotkeys to various online media players.

##Installation

####Requirements
Node.js

####Install
Clone the repo and then
```bash
$ npm install
```
to install dependencies. To build the extension run
```bash
$ grunt dev
```

##Grunt Tasks
`grunt dev`: Lints `code/*`, runs browserify and copies built code to `build/unpacked-dev/` and `test/streamkeys-ext/`

`grunt rel`: Lints `code/*`, runs browserify and uglify and copies built code to `build/unpacked-prod/` and `test/streamkeys-ext/`

`grunt watch`: Watches for changes to JS files in `code/*`, lints `code/*`, runs browserify and copies built code to `build/unpacked-dev/`

`grunt lint`: Lints `code/*`

`grunt rel-test`: Everything in `rel` and then runs the test suite

##Info:
This extension works by sending click events to the elements that control the music player. Each music site has an associated controller which contains the css selectors for the play/pause/next/previous/mute buttons (where available). In addition there is a `BaseController` module which contains common functions that are shared across all controllers.

The background script routes hotkey presses from the user to the correct tab (ie., the media player(s) tab) if the media player site is enabled.

##Adding Sites:
Adding a new site to the extension is pretty easy. There are 3 steps:

####Add site controller
Figure out the css selectors for a site's media player buttons and create a new controller in `code/js/controllers/`. Naming scheme is `{Sitename}Controller.js`. You should copy code from an exisiting controller as a template. Here is an example controller for Fooplayer:

```javascript
Filename: FooplayerController.js

;(function() {
  "use strict";

  require("BaseController").init({
    playPause: "#play_btn",
    playNext: "#next_btn",
    playPrev: "#prev_btn",
    mute: "#mute_btn"
  });
})();
```

####Add site to sitelist
Next add the site to the Sitelist object in `code/js/modules/Sitelist.js`. It is important that the url is correct, and that the object's name is contained in the URL.

```javascript
"fooplay": {name: "Fooplay", url: "http://www.fooplayer.com", enabled: true, url_regex: null}
```

####Add controller to manifest
Finally, add your new controller to the `content_scripts` array in the manifest file.

```javascript
{
  "matches": ["*://*.fooplayer.com/*"],
  "js": ["js/controllers/FooplayerController.js"]
}
```

##Tests:
There is a Mocha/Selenium integration test suite that is intended to discover if a site changes their players which will break the extension. The automated Travis-CI with trigger on every pull request/push. To run the tests locally you will require chromedriver somehwere in your path. The node module `selenium-chromedriver` will do that for you. After `npm install` the chromedriver binary can be found in `node_modules/selenium-chromedriver/bin`. To run the tests:
```
node test/runner.js
```

##Default hotkeys:

* Mediakeys: play/pause, next, previous
* Ctrl + Shift + 2: mute

##TODO:
* Redo tab stack
* See if media keys can work with mac
* Test on Ubuntu/Linux and ChromeOS
* See if it can work with embedded players (ie. soundcloud). Maybe check for existence of some element, if found add tab to stack (should be done after load)?
* Add tests for Amazon, Pandora, Plex, PocketCasts Seesu, Spotify, VK

##License (MIT)

Copyright (c) 2014 Alex Gabriel under the MIT license.
