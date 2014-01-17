## Music player hotkeys
This is a simple script to send "global" (ie. across the browser) hotkeys to various online media players.<br>

##Default hotkeys:

* ALT + Q: Toggle play/pause
* ALT + A: Previous song
* ALT + S: Next Song
* ALT + M: Toggle mute

##Info:

This extension works by sending click events to the elements that control the music player. Content scripts are used to capture key presses and interact with the pages DOM. The background script routes hotkey presses from a content script to the correct tab, ie., the media player(s) tab

##TODO:

Try to add capturing hotkeys when not focused on page. (not possible with content scripts...)

Switch to chrome commands API for better key capturing
