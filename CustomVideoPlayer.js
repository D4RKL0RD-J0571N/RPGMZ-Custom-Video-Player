/*:
 * @target MZ
 * @plugindesc Adds a custom video player to RPG Maker MZ. Supports fade, looping, wait, and skip options. 📽️
 * @author J0571N
 *
 * @command PlayCustomVideo
 * @text Play Video
 * @desc Plays a custom video with various settings.
 *
 * @arg src
 * @type string
 * @text Video Source
 * @desc Name of the video file (without extension) in the 'movies' folder.
 *
 * @arg speed
 * @type number
 * @decimals 2
 * @min 0.1
 * @max 16.0
 * @default 1.0
 * @text Playback Speed
 * @desc Speed multiplier for playback. Default is 1.0.
 *
 * @arg wait
 * @type boolean
 * @text Wait for Video to Finish
 * @desc Whether the event should wait until the video ends before continuing.
 * @default true
 *
 * @arg fade
 * @type boolean
 * @text Fade In Video
 * @desc Whether the video should fade in smoothly.
 * @default true
 *
 * @arg skipEnabled
 * @type boolean
 * @text Allow Skip
 * @desc Whether the player can skip the video.
 * @default true
 *
 * @arg loop
 * @type boolean
 * @text Loop Video
 * @desc Whether the video should loop continuously.
 * @default false
 *
 * @arg width
 * @type number
 * @min 10
 * @max 100
 * @default 100
 * @text Width (%)
 * @desc Width of the video in percentage of screen.
 *
 * @arg height
 * @type number
 * @min 10
 * @max 100
 * @default 100
 * @text Height (%)
 * @desc Height of the video in percentage of screen.
 */

(() => {
    const PLUGIN_NAME = "CustomVideoPlayer";

    let customVideoElement = null;
    let skipEventListener = null;

    function setDimensions(video, width, height) {
        video.style.width = `${width}%`;
        video.style.height = `${height}%`;
    }

    function detectVideoExtension() {
        // You can adjust this function depending on platform support
        return Utils.canPlayWebm ? ".webm" : ".mp4";
    }

    function cleanupAndDestroyVideoElement() {
        if (customVideoElement) {
            if (skipEventListener) {
                document.removeEventListener("keydown", skipEventListener);
                customVideoElement.removeEventListener("mousedown", skipEventListener);
                customVideoElement.removeEventListener("touchend", skipEventListener);
                skipEventListener = null;
            }
            if (document.body.contains(customVideoElement)) {
                document.body.removeChild(customVideoElement);
            }
            customVideoElement = null;
        }
    }

    function createVideoElement(options) {
        if (customVideoElement) {
            cleanupAndDestroyVideoElement();
        }

        const video = document.createElement("video");

        video.src = options.source;
        video.id = "customVideoPlayer";
        video.style.position = "absolute";
        video.style.top = "50%";
        video.style.left = "50%";
        video.style.transform = "translate(-50%, -50%)";
        setDimensions(video, options.width, options.height);
        video.style.zIndex = 100;
        video.style.objectFit = "contain";
        video.style.backgroundColor = "black";
        video.style.opacity = options.fade ? "0" : "1";
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        video.volume = 1.0;
        video.playbackRate = options.speed;
        video.loop = options.loop;

        // Video ended handler
        video.addEventListener("ended", () => {
            if (!options.loop) {
                cleanupAndDestroyVideoElement();
                if (typeof options.onEnd === "function") options.onEnd();
            }
        });

        // Always attach skip listeners if skipping is enabled
        if (options.skipEnabled) {
            skipEventListener = () => {
                cleanupAndDestroyVideoElement();
                if (typeof options.onEnd === "function") options.onEnd();
            };
            document.addEventListener("keydown", skipEventListener);
            video.addEventListener("mousedown", skipEventListener);
            video.addEventListener("touchend", skipEventListener);
        }

        document.body.appendChild(video);
        customVideoElement = video;

        video.play().then(() => {
            if (options.fade) {
                setTimeout(() => {
                    video.style.transition = "opacity 0.5s";
                    video.style.opacity = "1";
                }, 10);
            }
        });
    }

    PluginManager.registerCommand(PLUGIN_NAME, "PlayCustomVideo", function (args) {
        const baseName = args.src;
        const speed = parseFloat(args.speed) || 1.0;
        const waitModeActive = args.wait === "true";
        const fadeEffectEnabled = args.fade === "true";
        const skipAllowed = args.skipEnabled === "true";
        const videoDimensionsWidth = parseInt(args.width || 100);
        const videoDimensionsHeight = parseInt(args.height || 100);
        const loopModeActive = args.loop === "true";

        if (waitModeActive && !loopModeActive) {
            $gameTemp._customVideoPlaying = true;

            createVideoElement({
                source: `movies/${baseName}${detectVideoExtension()}`,
                speed,
                wait: waitModeActive,
                fade: fadeEffectEnabled,
                skipEnabled: skipAllowed,
                width: videoDimensionsWidth,
                height: videoDimensionsHeight,
                loop: loopModeActive,
                onEnd: () => $gameTemp._customVideoPlaying = false
            });

            this.setWaitMode("customVideo");
        } else {
            createVideoElement({
                source: `movies/${baseName}${detectVideoExtension()}`,
                speed,
                wait: waitModeActive,
                fade: fadeEffectEnabled,
                skipEnabled: skipAllowed,
                width: videoDimensionsWidth,
                height: videoDimensionsHeight,
                loop: loopModeActive
            });
        }
    });

    const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function () {
        if (this._waitMode === "customVideo") {
            return $gameTemp._customVideoPlaying;
        }
        return _Game_Interpreter_updateWaitMode.call(this);
    };

})();
