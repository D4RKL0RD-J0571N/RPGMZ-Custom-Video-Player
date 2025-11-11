# 🎥 Custom HTML5 Video Playback & Control Plugin for RPG Maker MZ

**Advanced Engine Extension | JavaScript | HTML5 Media Integration**

---

## 🧭 Overview

This project demonstrates a **custom media-integration layer** built to extend a commercial game engine (RPG Maker MZ) with **advanced HTML5 video playback controls**.  
Developed from scratch in JavaScript, the plugin allows **dynamic video speed control**, **looping**, **fade transitions**, and **non-blocking skip behavior** — all fully integrated with the engine’s event interpreter.

Although the original use case was experimental, the underlying system design applies to **any scenario requiring asynchronous, DOM-level media control** in a game engine environment.

---

## ⚙️ Core Features

- 🎚️ **Dynamic Playback Speed Control**  
  Adjust playback between `0.1×` and `16×` in real time using a single video file.  
  Reduces asset duplication while preserving synchronization and quality.

- 🔁 **Looping & Wait Mode Synchronization**  
  Introduces a custom wait state (`"customVideo"`) within the engine’s event system.  
  Game logic halts automatically until video playback ends, even across looped or skipped content.

- 🌫️ **Smooth Fade Transitions**  
  Implements CSS-driven opacity transitions for non-blocking fade-ins, maintaining immersion and reducing visual popping.

- ⏯️ **User Skip Events & Robust Cleanup**  
  Keyboard, mouse, and touch inputs can instantly terminate playback.  
  A centralized cleanup routine ensures the DOM and memory remain stable between runs.

- 🪟 **DOM Layer & Engine Integration**  
  Injects an HTML5 `<video>` element dynamically above the WebGL canvas, managing `z-index`, scaling, and alignment for consistent display across resolutions.

- 🌐 **Cross-Platform Format Detection**  
  Uses the engine’s `Utils.canPlayWebm` to select optimal codecs (`.webm` or `.mp4`) automatically, ensuring compatibility with browsers and desktop runtimes.

---

## 🧠 Technical Highlights

| Engineering Focus | Implementation Detail |
|--------------------|------------------------|
| **Engine Integration & Execution Flow** | Custom `waitMode` (`"customVideo"`) wired into `Game_Interpreter.prototype.updateWaitMode`, enabling synchronous event handling within an asynchronous DOM context. |
| **Dynamic UI Layering** | Direct manipulation of the DOM (`video.style.zIndex`, `position: absolute`, `transform`) to overlay video on top of or beneath game layers. |
| **Event Handling & Lifecycle Management** | Consolidated skip, end, and cleanup handlers with explicit `removeEventListener` calls to prevent leaks. |
| **Asynchronous Playback Pipeline** | Leverages the `video.play().then()` promise chain for reliable playback startup and transition timing. |
| **Extensible Plugin Command Interface** | Exposed structured arguments (`@command`, `@arg`) for easy use in RPG Maker’s event editor—no manual coding required. |

---

## 🧩 Example Command

```js
@command PlayCustomVideo
@text Play Video
@desc Plays a custom video with configurable parameters.

@arg src
@type string
@text Video Source
@desc Name of the video file (without extension).

@arg speed
@type number
@default 1.0
@text Playback Speed
@desc Multiplier for playback rate (0.1×–16×).

this.pluginCommand("CustomVideoPlayer", "PlayCustomVideo", {
  src: "intro_scene",
  speed: 1.5,
  wait: true,
  fade: true,
  skipEnabled: true,
  loop: false,
  width: 100,
  height: 100
});
```
---
🧩 Key Code Concepts
| Function                          | Purpose                                                                               |
| --------------------------------- | ------------------------------------------------------------------------------------- |
| `createVideoElement(options)`     | Dynamically builds and configures an HTML5 `<video>` element with runtime parameters. |
| `cleanupAndDestroyVideoElement()` | Ensures all listeners are detached and the DOM remains clean post-playback.           |
| `detectVideoExtension()`          | Chooses between `.webm` or `.mp4` depending on engine/browser support.                |
| `this.setWaitMode("customVideo")` | Integrates the media system into RPG Maker’s event flow for synchronized progression. |


---
💡 Engineering Value
This project illustrates the ability to:

Interface external browser-level APIs with an embedded game engine runtime.

Extend a closed engine through non-intrusive scripting hooks.

Manage media, state, and event flow across asynchronous systems.

Implement robust cleanup, input, and transition logic at a low level.

Such cross-boundary work parallels the integration challenges found in large-scale engines like Unreal, Unity, or proprietary frameworks — making it a valuable demonstration of adaptability and system-level understanding.

---
🧰 Tech Stack
Language: JavaScript (ES6)

Platform: RPG Maker MZ (HTML5/Canvas)

APIs Used: HTML5 <video>, DOM Events, CSS Transitions

Design Patterns: Event-Driven, Modular, Lifecycle-Managed

---
📜 License
This plugin was created for educational and portfolio purposes.
It may be freely studied, reused, or adapted for non-commercial projects.

Author: [Jostin Lopez (J0571N)]

Focus: Engine Integration • Media Systems • JavaScript Game Architecture

---
