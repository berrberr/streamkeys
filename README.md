## Grooveshark hotkeys
This is a very simple script to send "global" (ie. across the browser) hotkeys to the grooveshark player.<br>
The basic background/content script interaction can be easily extended into other projects using the framework provided in the files in /background and /contentscript. Just be sure to edit your Manifest file accordingly.
##Default hotkeys:
* ALT + Q: Toggle play/pause
* ALT + A: Previous song
* ALT + S: Next Song
* ALT + M: Toggle mute

## Grooveshark player link ids, text

* a id="play-pause" <Play>
* a id="play-prev" <Previous Song>
* a id="play-next" <Next Song>
* a id="volume" <Sound Volume. Click to Mute.>
* a id="broadcast-menu-btn" <Start Broadcasting>

## Grooveshark useful info

* div id="now-playing-metadata"
  * a class="now-playing-link song" <- song name
  * a class="now-playing-link artist" <- artist name

* form id="lightbox-login-form" method="post" action="https://grooveshark.com/empty.html"
  * input type="text" id="login-username" name="username"
  * input type="password" id="login-password" name="password"

## Resources:
Icon downloaded from here: <http://wall-e-ps.deviantart.com/art/grooveshark-icon-by-wall-e-171583886>
The code for the content script communication is based off of: <https://github.com/dan-lee/chrome-extension-communicator>