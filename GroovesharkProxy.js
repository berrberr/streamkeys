var GroovesharkProxyDiv = document.createElement('div');
GroovesharkProxyDiv.id = 'GroovesharkProxyDiv';
GroovesharkProxyDiv.style.display = 'none';
document.body.appendChild(GroovesharkProxyDiv);

// This is the function that will be injected into the page via a script tag.
function runOnPage() {
    // Cache the get values every time the song status changes so it can be pulled from the proxy.
    var GSGetMethods = [
        'getAPIVersion',
        'getApplicationVersion',
        'getCurrentSongStatus',
        'getNextSong',
        'getPreviousSong',
        'getVolume',
        'getVoteForCurrentSong'
    ];
    function cacheGetValues() {
        var values = {};
        for (var i = 0; i < GSGetMethods.length; i++) {
            values[GSGetMethods[i]] = window.Grooveshark[GSGetMethods[i]]();
        }
        GroovesharkProxyDiv.setAttribute('data-gs-get-values', JSON.stringify(values));
    }

    var GroovesharkProxyDiv = document.getElementById('GroovesharkProxyDiv');

    // Always use this callback in the actual page so we can cache the values, and send it to
    // any possible callback set in the extension.
    function songStatusCallback(data) {
        cacheGetValues();
        GroovesharkProxyDiv.innerText = JSON.stringify(data);
        var evt = document.createEvent("Event");
        evt.initEvent("GroovesharkSongEvent", true, true );
        GroovesharkProxyDiv.dispatchEvent(evt);
    }

    // Listen for events sent to the page from the extension, and rn them with any
    // arguments stored in the attributes.  Cache the get values afterwards in case
    // anything changed.
    GroovesharkProxyDiv.addEventListener('GroovesharkSendAction', function() {
        var f = window.Grooveshark[GroovesharkProxyDiv.getAttribute('data-send-action')]
        var args = JSON.parse(GroovesharkProxyDiv.getAttribute('data-send-action-arguments'));
        f.apply(window.Grooveshark, args);
        cacheGetValues();
    });
    window.Grooveshark.setSongStatusCallback(songStatusCallback);
}

// Append and run the script.
var script = document.createElement('script');
script.innerHTML = runOnPage + "\nrunOnPage();";
document.body.appendChild(script);

var GroovesharkProxy = {};
// Call a method on the Grooveshark object in the page.  This is done
// by passing the function name and arguments in attributes.
GroovesharkProxy.sendAction = function(action, args) {
    GroovesharkProxyDiv.setAttribute('data-send-action', action);
    GroovesharkProxyDiv.setAttribute('data-send-action-arguments', JSON.stringify(args));
    var evt = document.createEvent('Event');
    evt.initEvent('GroovesharkSendAction', true, true);
    GroovesharkProxyDiv.dispatchEvent(evt);
}
GroovesharkProxy.apiCalls = [
    'addAlbumById',
    'addCurrentSongToLibrary',
    'addPlaylistByID',
    'addSongByToken',
    'addSongsByID',
    'executeProtocol',
    'favoriteCurrentSong',
    'next',
    'pause',
    'play',
    'previous',
    'removeCurrentSongFromQueue',
    'seekToPosition',
    'setSongStatusCallback',
    'setVolume',
    'togglePlayPause',
    'voteCurrentSong'
];

GroovesharkProxy.apiGetCalls = [
    'getAPIVersion',
    'getApplicationVersion',
    'getCurrentSongStatus',
    'getNextSong',
    'getPreviousSong',
    'getVolume',
    'getVoteForCurrentSong'
];

function createActionFunc(funcName) {
    return function() {
        // Convert arguments to an actual array.
        var args = Array.prototype.slice.call(arguments);
        GroovesharkProxy.sendAction(funcName, args);
    }
}

function createGetFunc(funcName) {
    return function() {
        var values = JSON.parse(GroovesharkProxyDiv.getAttribute('data-gs-get-values'));
        return values[funcName];
    }
}

for (var i = 0; i < GroovesharkProxy.apiCalls.length; ++i) {
    var funcName = GroovesharkProxy.apiCalls[i];
    GroovesharkProxy[funcName] = createActionFunc(funcName);
};

for (var i = 0; i < GroovesharkProxy.apiGetCalls.length; ++i) {
    var funcName = GroovesharkProxy.apiGetCalls[i];
    GroovesharkProxy[funcName] = createGetFunc(funcName);
};

GroovesharkProxy.setSongStatusCallback = function(cb) {
    GroovesharkProxy.songStatusCallback = cb;
}

GroovesharkProxyDiv.addEventListener('GroovesharkSongEvent', function() {
    if (!GroovesharkProxy.songStatusCallback) return;
    var data = JSON.parse(GroovesharkProxyDiv.innerText);
    GroovesharkProxy.songStatusCallback(data);
});

