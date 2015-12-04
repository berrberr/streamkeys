# Streamkeys v1.5.3 [![Build Status](https://travis-ci.org/berrberr/streamkeys.svg?branch=master)](https://travis-ci.org/berrberr/streamkeys)

Chrome extension to send "global" (ie. across the browser) hotkeys to various online media players.

It is available on the Chrome Store:

https://chrome.google.com/webstore/detail/streamkeys/ekpipjofdicppbepocohdlgenahaneen?hl=en

## Installation

#### Requirements

- Node.js

#### Install

Clone the repo and then

```bash
$ npm install
```

to install dependencies. Then to build the extension run

```bash
$ grunt dev
```

## Grunt Tasks

- `grunt dev`: Lints `code/*`, runs browserify and copies built code to `build/unpacked-dev/` and `test/streamkeys-ext/`

- `grunt rel`: Lints `code/*`, runs browserify and uglify and copies built code to `build/unpacked-prod/` and `test/streamkeys-ext/`

- `grunt watch`: Watches for changes to JS files in `code/*`, lints `code/*`, runs browserify and copies built code to `build/unpacked-dev/`

- `grunt lint`: Lints `code/*`

- `grunt rel-test`: Everything in `rel` and then runs the test suite

## Info

This extension works by sending click events to the elements that control the music player. Each music site has an associated controller which contains the css selectors for the play/pause/next/previous/mute buttons (where available). In addition there is a [`BaseController`][0] module which contains common functions that are shared across all controllers.

The background script routes hotkey presses from the user to the correct tab (ie., the media player(s) tab) if the media player site is enabled.

## Adding Sites

Adding a new site to the extension is straight forward. There are 3 steps:

#### 1. Add site controller

Figure out the css selectors for a site's media player buttons and create a new controller in `code/js/controllers/`. Naming scheme is `{Sitename}Controller.js`. You should copy code from an exisiting controller as a template. Here is an example controller for Fooplayer:

```javascript
Filename: FooplayerController.js

;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    playPause: "#play_btn",
    playNext: "#next_btn",
    playPrev: "#prev_btn",
    mute: "#mute_btn"
  });
})();
```

#### 2. Add site to sitelist

Next, add the site to the Sitelist object in `code/js/modules/Sitelist.js`.

```javascript
"fooplay": {name: "Fooplay", url: "http://www.fooplayer.com", enabled: true, url_regex: null}
```

The object key name is very important. It serves two purposes: constructs the site's controller name as well as builds the regular expression which will be used to check URLs to inject the controller into. It is important that the url is correct, and that the object's key name is contained in the URL.

If it is not possible for the object's key name to be part of the sites URL then you can add the optional `alias` array field to the object which will add the array's contents into the regular expression to match URLs. For example, for lastFM:

```javascript
"last": {name: "LastFm", url: "http://www.last.fm", controller: "LastfmController.js", enabled: true, url_regex: null, alias: ["lastfm"]}
```
the alias here will match URLs: last.* AND lastfm.*

The logic to construct the controller name is: Capitalized object key + "Controller". So, using the above example we should name our LastFM controller: "LastController" based on that key name.

If it is not possible for the controller file to be named according to that scheme then add the optional `controller` property to the site object and put the FULL controller name there, for example: "SonyMusicUnlimitedController.js"

## Tests

There is a Mocha/Selenium integration test suite that is intended to discover if a site changes their players which will break the extension. The automated Travis-CI will trigger on every pull request/push.

To run the tests locally you will require ChromeDriver somewhere in your path. The node module `selenium-chromedriver` will do that for you. After `npm install` the ChromeDriver binary can be found in `node_modules/selenium-chromedriver/bin`. To run the tests:

```
node test/runner.js
```

## Default hotkeys

- Mediakeys: play/pause, next, previous
- `Ctrl` + `Shift` + `2`: mute

## TODO

- Redo tab stack
- Test on Ubuntu/Linux and ChromeOS
- See if it can work with embedded players (ie. soundcloud). Maybe check for existence of some element, if found add tab to stack (should be done after load)?
- Add tests for Amazon, Pandora, Plex, PocketCasts Seesu, Spotify, VK

## License (MIT)

Copyright (c) 2014 Alex Gabriel under the MIT license.

[0]: https://github.com/berrberr/streamkeys/blob/master/code/js/modules/BaseController.js
