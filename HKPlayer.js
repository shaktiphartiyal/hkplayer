class HKPlayer
{
    constructor()
    {
        this.players = [];
        this.virtualPlayers = {};
        this.setStyles();
        this.getPlayers();
        this.initPlayers();
    }
    setStyles()
    {
        let style = document.createElement('style');
        style.innerHTML = this._getStyles();
        document.getElementsByTagName("head")[0].appendChild(style);
    }
    generateRandomId()
    {
        let length = Math.round(Math.random()*15);
        return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
    }
    getPlayers()
    {
        this.players = document.getElementsByTagName("HKPlayer");
    }
    initPlayers()
    {
        for(let player of this.players)
        {
            this._initPlayer(player);
        }
    }
    _initPlayer(player)
    {
        const videoId = this.generateRandomId();
        this.virtualPlayers[videoId] = player.cloneNode(true);
        let videoDiv = document.createElement('div');
        videoDiv.id = 'HKPlayer-master-'+videoId;
        videoDiv.classList = 'HKPlayerPlayerTheme-'+player.getAttribute('theme');

        let video = document.createElement('video');
        video.id = videoId;
        video.controls = false;
        video.ontimeupdate = this.updateMediaProgress;

        video.addEventListener('contextmenu', this.mediaContext, false);
        video.addEventListener('click', this.playPauseMedia, false);
        video.addEventListener('loadstart', this.showMediaLoading, false);
        video.addEventListener('canplay', this.showMediaLoading, false);

        let source = document.createElement('source');
        source.src = player.getAttribute('src');
        video.appendChild(source);
        videoDiv.appendChild(video);
        let controlDiv = this._getControls(player, videoId);
        videoDiv.appendChild(controlDiv);
        //player.appendChild(videoDiv);
        player.replaceWith(videoDiv);
    }

    mediaContext(event)
    {
        event.preventDefault();
        return false;
    }

    _getControls(player, videoId)
    {
        let controlDiv = document.createElement('div');
        controlDiv.id = 'controls-'+videoId;
        controlDiv.classList = 'HKPlayerControls';

        let progress = document.createElement('progress');
        progress.id = 'HKPlayer-progress-'+videoId;
        progress.classList = 'HKPlayer-progress';
        progress.setAttribute('min', '0');
        progress.setAttribute('max', '100');
        progress.setAttribute('value', '0');
        progress.setAttribute('data-for', videoId);
        progress.addEventListener('click', this.seekMedia, false);
        controlDiv.appendChild(progress);


        let replayButton = document.createElement('button');
        replayButton.id = 'HKPlayer-replay-'+videoId;
        replayButton.setAttribute('data-for', videoId);
        replayButton.classList = 'HKPlayer-replay';
        replayButton.title = 'Replay';
        replayButton.innerHTML = ' ';
        replayButton.addEventListener('click',this.restartMedia);
        controlDiv.appendChild(replayButton);

        let playPauseButton = document.createElement('button');
        playPauseButton.id = 'HKPlayer-playPause-'+videoId;
        playPauseButton.setAttribute('data-for', videoId);
        playPauseButton.classList = 'HKPlayer-play';
        playPauseButton.title = 'Play';
        playPauseButton.innerHTML = '';
        playPauseButton.addEventListener('click',this.playPauseMedia);
        controlDiv.appendChild(playPauseButton);

        let stopButton = document.createElement('button');
        stopButton.id = 'HKPlayer-stop-'+videoId;
        stopButton.setAttribute('data-for', videoId);
        stopButton.classList = 'HKPlayer-stop';
        stopButton.title = 'Stop';
        stopButton.innerHTML = ' ';
        stopButton.addEventListener('click',this.stopMedia);
        controlDiv.appendChild(stopButton);

        let volumeMuteButton = document.createElement('button');
        volumeMuteButton.id = 'HKPlayer-volumeMuteUnmute-'+videoId;
        volumeMuteButton.setAttribute('data-for', videoId);
        volumeMuteButton.classList = 'HKPlayer-volumeMute';
        volumeMuteButton.title = 'Mute';
        volumeMuteButton.innerHTML = ' ';
        volumeMuteButton.addEventListener('click',this.muteUnmuteMedia);
        controlDiv.appendChild(volumeMuteButton);

        let fullScreenToggleButton = document.createElement('button');
        fullScreenToggleButton.id = 'HKPlayer-fullScreenToggle-'+videoId;
        fullScreenToggleButton.setAttribute('data-for', videoId);
        fullScreenToggleButton.classList = 'HKPlayer-fullScreenToggle';
        fullScreenToggleButton.title = 'Fullscreen';
        fullScreenToggleButton.innerHTML = ' ';
        fullScreenToggleButton.addEventListener('click',this.fullScreen);
        controlDiv.appendChild(fullScreenToggleButton);

        let volumeRange = document.createElement('input');
        volumeRange.type = 'range';
        volumeRange.min = 0;
        volumeRange.max = 100;
        volumeRange.id = 'HKPlayer-volume-'+videoId;
        volumeRange.setAttribute('data-for', videoId);
        volumeRange.classList = 'HKPlayer-volume';
        volumeRange.title = 'Volume';
        volumeRange.innerHTML = '';
        volumeRange.addEventListener('change', this.setMediaVolume, false);
        controlDiv.appendChild(volumeRange);

        return controlDiv;
    }

    fullScreen(control)
    {
        let button = control.srcElement;
        let id = button.getAttribute('data-for');
        let videoPlayer = document.getElementById('HKPlayer-master-'+id);
        let isFullScreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        if (isFullScreen)
        {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        else
        {
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
        if(typeof(callback) == "function")
        {
            callback();
        }
    }

    restartMedia(control)
    {
        let button = control.srcElement;
        let id = button.getAttribute('data-for');
        let video = document.getElementById(id);
        video.currentTime = 0;
    }

    playPauseMedia(control)
    {
        let button = control.srcElement;
        let id = button.getAttribute('data-for');
        let video = document.getElementById(id);
        if(!video)
        {
            video = control.srcElement;
            id = video.id;
            button = document.getElementById('HKPlayer-playPause-'+id);
        }
        if (video.paused)
        {
            button.classList = 'HKPlayer-pause';
            video.play();
        }
        else
        {
            button.classList = 'HKPlayer-play';
            video.pause();
        }
    }

    seekMedia(event)
    {
        let progressBar = event.srcElement;
        let videoId = progressBar.getAttribute('data-for');
        let video = document.getElementById(videoId);
         let offsetLeft = progressBar.offsetLeft;
        let left = (event.pageX - offsetLeft);
        let totalWidth = progressBar.scrollWidth;
        let percentage = ( left / totalWidth );
        let videoTime = percentage*video.duration;
        video.currentTime = videoTime;
    }

    stopMedia(control)
    {
        let button = control.srcElement;
        let id = button.getAttribute('data-for');
        let video = document.getElementById(id);
        video.pause();
        video.currentTime = 0;
        let playPauseButton = document.getElementById('HKPlayer-playPause-'+id);
        playPauseButton.classList = 'HKPlayer-play';
    }
    muteUnmuteMedia(control)
    {
        let button = control.srcElement;
        let id = button.getAttribute('data-for');
        let video = document.getElementById(id);
        if(video.muted)
        {
            button.classList = 'HKPlayer-volumeMute';
            video.muted= false;
        }
        else
        {
            button.classList = 'HKPlayer-volumeUnmute';
            video.muted= true;
        }
    }

    setMediaVolume(event)
    {
        let range = event.srcElement;
        let id = range.getAttribute('data-for');
        let video = document.getElementById(id);
        video.volume = range.value/100;
    }

    showMediaLoading(event)
    {
        let video = event.srcElement;
        let videoId = video.id;
        if(event.type == 'loadstart')
        {
            video.poster = 'icons/buffering.svg';
        }
        else if(event.type == 'canplay')
        {
            video.removeAttribute('poster');
        }
    }

    updateMediaProgress(event)
    {
        let video = event.srcElement;
        let videoId = video.id;
        let progresbar = document.getElementById('HKPlayer-progress-'+videoId);
        let percentage = ( video.currentTime / video.duration ) * 100;
        progresbar.value = percentage;
    }


    _getStyles()
    {

    }
}

(function(funcName, baseObj) {
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
        if ( document.readyState === "complete" ) {
            ready();
        }
    }

    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function(callback, context) {
        if (typeof callback !== "function") {
            throw new TypeError("callback for docReady(fn) must be a function");
        }
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({fn: callback, ctx: context});
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
    }
})("docReady", window);

docReady(function () {
    new HKPlayer();
});