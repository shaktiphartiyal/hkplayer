"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HKPlayer = function () {
    function HKPlayer() {
        _classCallCheck(this, HKPlayer);

        this.players = [];
        this.virtualPlayers = {};
        this.setStyles();
        this.getPlayers();
        this.initPlayers();
    }

    _createClass(HKPlayer, [{
        key: "setStyles",
        value: function setStyles() {
            var style = document.createElement('style');
            style.innerHTML = this._getStyles();
            document.getElementsByTagName("head")[0].appendChild(style);
        }
    }, {
        key: "generateRandomId",
        value: function generateRandomId() {
            var length = Math.round(Math.random() * 15);
            return Math.round(Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)).toString(36).slice(1);
        }
    }, {
        key: "getPlayers",
        value: function getPlayers() {
            this.players = document.getElementsByTagName("HKPlayer");
        }
    }, {
        key: "initPlayers",
        value: function initPlayers() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var player = _step.value;

                    this._initPlayer(player);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "_initPlayer",
        value: function _initPlayer(player) {
            var videoId = this.generateRandomId();
            this.virtualPlayers[videoId] = player.cloneNode(true);
            var videoDiv = document.createElement('div');
            videoDiv.id = 'HKPlayer-master-' + videoId;
            videoDiv.classList = 'HKPlayerPlayerTheme-' + player.getAttribute('theme');

            var video = document.createElement('video');
            video.id = videoId;
            video.controls = false;
            video.ontimeupdate = this.updateMediaProgress;

            video.addEventListener('contextmenu', this.mediaContext, false);
            video.addEventListener('click', this.playPauseMedia, false);
            video.addEventListener('loadstart', this.showMediaLoading, false);
            video.addEventListener('canplay', this.showMediaLoading, false);

            var source = document.createElement('source');
            source.src = player.getAttribute('src');
            video.appendChild(source);
            videoDiv.appendChild(video);
            var controlDiv = this._getControls(player, videoId);
            videoDiv.appendChild(controlDiv);
            //player.appendChild(videoDiv);
            player.replaceWith(videoDiv);
        }
    }, {
        key: "mediaContext",
        value: function mediaContext(event) {
            event.preventDefault();
            return false;
        }
    }, {
        key: "_getControls",
        value: function _getControls(player, videoId) {
            var controlDiv = document.createElement('div');
            controlDiv.id = 'controls-' + videoId;
            controlDiv.classList = 'HKPlayerControls';

            var progress = document.createElement('progress');
            progress.id = 'HKPlayer-progress-' + videoId;
            progress.classList = 'HKPlayer-progress';
            progress.setAttribute('min', '0');
            progress.setAttribute('max', '100');
            progress.setAttribute('value', '0');
            progress.setAttribute('data-for', videoId);
            progress.addEventListener('click', this.seekMedia, false);
            controlDiv.appendChild(progress);

            var replayButton = document.createElement('button');
            replayButton.id = 'HKPlayer-replay-' + videoId;
            replayButton.setAttribute('data-for', videoId);
            replayButton.classList = 'HKPlayer-replay';
            replayButton.title = 'Replay';
            replayButton.innerHTML = ' ';
            replayButton.addEventListener('click', this.restartMedia);
            controlDiv.appendChild(replayButton);

            var playPauseButton = document.createElement('button');
            playPauseButton.id = 'HKPlayer-playPause-' + videoId;
            playPauseButton.setAttribute('data-for', videoId);
            playPauseButton.classList = 'HKPlayer-play';
            playPauseButton.title = 'Play';
            playPauseButton.innerHTML = '';
            playPauseButton.addEventListener('click', this.playPauseMedia);
            controlDiv.appendChild(playPauseButton);

            var stopButton = document.createElement('button');
            stopButton.id = 'HKPlayer-stop-' + videoId;
            stopButton.setAttribute('data-for', videoId);
            stopButton.classList = 'HKPlayer-stop';
            stopButton.title = 'Stop';
            stopButton.innerHTML = ' ';
            stopButton.addEventListener('click', this.stopMedia);
            controlDiv.appendChild(stopButton);

            var volumeMuteButton = document.createElement('button');
            volumeMuteButton.id = 'HKPlayer-volumeMuteUnmute-' + videoId;
            volumeMuteButton.setAttribute('data-for', videoId);
            volumeMuteButton.classList = 'HKPlayer-volumeMute';
            volumeMuteButton.title = 'Mute';
            volumeMuteButton.innerHTML = ' ';
            volumeMuteButton.addEventListener('click', this.muteUnmuteMedia);
            controlDiv.appendChild(volumeMuteButton);

            var fullScreenToggleButton = document.createElement('button');
            fullScreenToggleButton.id = 'HKPlayer-fullScreenToggle-' + videoId;
            fullScreenToggleButton.setAttribute('data-for', videoId);
            fullScreenToggleButton.classList = 'HKPlayer-fullScreenToggle';
            fullScreenToggleButton.title = 'Fullscreen';
            fullScreenToggleButton.innerHTML = ' ';
            fullScreenToggleButton.addEventListener('click', this.fullScreen);
            controlDiv.appendChild(fullScreenToggleButton);

            var volumeRange = document.createElement('input');
            volumeRange.type = 'range';
            volumeRange.min = 0;
            volumeRange.max = 100;
            volumeRange.id = 'HKPlayer-volume-' + videoId;
            volumeRange.setAttribute('data-for', videoId);
            volumeRange.classList = 'HKPlayer-volume';
            volumeRange.title = 'Volume';
            volumeRange.innerHTML = '';
            volumeRange.addEventListener('change', this.setMediaVolume, false);
            controlDiv.appendChild(volumeRange);

            return controlDiv;
        }
    }, {
        key: "fullScreen",
        value: function fullScreen(control) {
            var button = control.srcElement;
            var id = button.getAttribute('data-for');
            var videoPlayer = document.getElementById('HKPlayer-master-' + id);
            var isFullScreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
            if (isFullScreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (videoPlayer.requestFullscreen) {
                    videoPlayer.requestFullscreen();
                } else if (videoPlayer.mozRequestFullScreen) {
                    videoPlayer.mozRequestFullScreen();
                } else if (videoPlayer.webkitRequestFullscreen) {
                    videoPlayer.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                } else if (videoPlayer.msRequestFullscreen) {
                    videoPlayer.msRequestFullscreen();
                }
            }
            if (typeof callback == "function") {
                callback();
            }
        }
    }, {
        key: "restartMedia",
        value: function restartMedia(control) {
            var button = control.srcElement;
            var id = button.getAttribute('data-for');
            var video = document.getElementById(id);
            video.currentTime = 0;
        }
    }, {
        key: "playPauseMedia",
        value: function playPauseMedia(control) {
            var button = control.srcElement;
            var id = button.getAttribute('data-for');
            var video = document.getElementById(id);
            if (!video) {
                video = control.srcElement;
                id = video.id;
                button = document.getElementById('HKPlayer-playPause-' + id);
            }
            if (video.paused) {
                button.classList = 'HKPlayer-pause';
                video.play();
            } else {
                button.classList = 'HKPlayer-play';
                video.pause();
            }
        }
    }, {
        key: "seekMedia",
        value: function seekMedia(event) {
            var progressBar = event.srcElement;
            var videoId = progressBar.getAttribute('data-for');
            var video = document.getElementById(videoId);
            var offsetLeft = progressBar.offsetLeft;
            var left = event.pageX - offsetLeft;
            var totalWidth = progressBar.scrollWidth;
            var percentage = left / totalWidth;
            var videoTime = percentage * video.duration;
            video.currentTime = videoTime;
        }
    }, {
        key: "stopMedia",
        value: function stopMedia(control) {
            var button = control.srcElement;
            var id = button.getAttribute('data-for');
            var video = document.getElementById(id);
            video.pause();
            video.currentTime = 0;
            var playPauseButton = document.getElementById('HKPlayer-playPause-' + id);
            playPauseButton.classList = 'HKPlayer-play';
        }
    }, {
        key: "muteUnmuteMedia",
        value: function muteUnmuteMedia(control) {
            var button = control.srcElement;
            var id = button.getAttribute('data-for');
            var video = document.getElementById(id);
            if (video.muted) {
                button.classList = 'HKPlayer-volumeMute';
                video.muted = false;
            } else {
                button.classList = 'HKPlayer-volumeUnmute';
                video.muted = true;
            }
        }
    }, {
        key: "setMediaVolume",
        value: function setMediaVolume(event) {
            var range = event.srcElement;
            var id = range.getAttribute('data-for');
            var video = document.getElementById(id);
            video.volume = range.value / 100;
        }
    }, {
        key: "showMediaLoading",
        value: function showMediaLoading(event) {
            var video = event.srcElement;
            var videoId = video.id;
            if (event.type == 'loadstart') {
                video.poster = 'icons/buffering.svg';
            } else if (event.type == 'canplay') {
                video.removeAttribute('poster');
            }
        }
    }, {
        key: "updateMediaProgress",
        value: function updateMediaProgress(event) {
            var video = event.srcElement;
            var videoId = video.id;
            var progresbar = document.getElementById('HKPlayer-progress-' + videoId);
            var percentage = video.currentTime / video.duration * 100;
            progresbar.value = percentage;
        }
    }, {
        key: "_getStyles",
        value: function _getStyles() {}
    }]);

    return HKPlayer;
}();

(function (funcName, baseObj) {
    // The public function name defaults to window.docReady
    // but you can pass in your own object and own function name and those will be used
    // if you want to put them in a different namespace
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }

    function readyStateChange() {
        if (document.readyState === "complete") {
            ready();
        }
    }

    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function (callback, context) {
        if (typeof callback !== "function") {
            throw new TypeError("callback for docReady(fn) must be a function");
        }
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function () {
                callback(context);
            }, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({ fn: callback, ctx: context });
        }
        // if document already ready to go, schedule the ready function to run
        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    };
})("docReady", window);

docReady(function () {
    new HKPlayer();
});
//# sourceMappingURL=HKPlayer.js.map