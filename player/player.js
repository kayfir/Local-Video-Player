// Version: 0.5

const container = document.querySelector(".container"),
mainVideo = container.querySelector("video"),
videoTimeline = container.querySelector(".video-timeline"),
progressBar = container.querySelector(".progress-bar"),
volumeBtn = container.querySelector(".volume span"),
volumeSlider = container.querySelector(".left input"),
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
replay = container.querySelector(".replay span"),
skip = container.querySelector(".skip span"),
playPauseBtn = container.querySelector(".play-pause span"),
speedBtn = container.querySelector(".playback-speed span"),
speedOptions = container.querySelector(".speed-options"),
subtitlesBtn = container.querySelector(".subtitles span"),
subsMenu = container.querySelector(".subs-menu"),
subsInput = document.getElementById("subsInput"),
fullscreenBtn = container.querySelector(".fullscreen span");
let currentTrack = null;
let timer;

const hideControls = () => {
	if(mainVideo.paused) return;
	timer = setTimeout(() => {
		container.classList.remove("show-controls");
	}, 1250);
}
hideControls();

container.addEventListener("mousemove", () => {
	container.classList.add("show-controls");
	clearTimeout(timer);
	hideControls();
});

const formatTime = time => {
	let seconds = Math.floor(time % 60),
	minutes = Math.floor(time / 60) %60,
	hours = Math.floor(time / 3600);
	
	seconds = seconds < 10 ? `0${seconds}` : seconds;
	minutes = minutes < 10 ? `0${minutes}` : minutes;
	hours = hours < 10 ? `0${hours}` : hours;
	
	if(hours == 0) {
		return `${minutes}:${seconds}`;
	}
	return `${hours}:${minutes}:${seconds}`;
}

mainVideo.addEventListener("timeupdate", e => {
	let { currentTime, duration } = e.target;
	let percent = (currentTime / duration) * 100;
	progressBar.style.width = `${percent}%`;
	currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadeddata", e => {
	videoDuration.innerText = formatTime(e.target.duration);
});

videoTimeline.addEventListener("click", e => {
	let timelineWidth = videoTimeline.clientWidth;
	mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

const draggableProgressBar = e => {
	let timelineWidth = videoTimeline.clientWidth;
	progressBar.style.width = `${e.offsetX}px`;
	mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
	currentVidTime.innerText = formatTime(mainVideo.currentTime);
}

videoTimeline.addEventListener("mousedown", () => {
	videoTimeline.addEventListener("mousemove", draggableProgressBar);
});

container.addEventListener("mouseup", () => {
	videoTimeline.removeEventListener("mousemove", draggableProgressBar);
});

videoTimeline.addEventListener("mousemove", e => {
	const progressTime = videoTimeline.querySelector("span");
	let offsetX = e.offsetX;
	progressTime.style.left = `${offsetX}px`;
	let timelineWidth = videoTimeline.clientWidth;
	let percent = (e.offsetX / timelineWidth) * mainVideo.duration;
	progressTime.innerText = formatTime(percent);
});

volumeBtn.addEventListener("click", () => {
    if(volumeBtn.innerText !== "volume_up") {
        mainVideo.volume = 0.5;
        volumeBtn.innerText = "volume_up";
    } else {
        mainVideo.volume = 0.0;
        volumeBtn.innerText = "volume_off";
    }
    volumeSlider.value = mainVideo.volume;
});

volumeSlider.addEventListener("input", e => {
	mainVideo.volume = e.target.value;
	if(e.target.value == 0) {
		volumeBtn.innerText = "volume_off";
	} else {
		volumeBtn.innerText = "volume_up";
	}
});

speedBtn.addEventListener("click", () => {
	speedOptions.classList.toggle("show");
});

speedOptions.querySelectorAll("li").forEach(option => {
	option.addEventListener("click", () => {
		mainVideo.playbackRate = option.dataset.speed;
		speedOptions.querySelector(".active").classList.remove("active");
		option.classList.add("active");
	});
});
document.addEventListener("click", e => {
	if(e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-sharp") {
		speedOptions.classList.remove("show");
	}
});

subtitlesBtn.addEventListener("click", () => {
	subsMenu.classList.toggle("show");
});

subsMenu.querySelectorAll("li").forEach(option => {
	option.addEventListener("click", () => {
		subsMenu.querySelector(".active").classList.remove("active");
		option.classList.add("active");
	});
});

document.addEventListener("click", e => {
	if(e.target.tagName !== "SPAN" || e.target.className !== "material-icons") {
		subsMenu.classList.remove("show");
	}
});

const loadSubtitleFile = (file) => {
	const reader = new FileReader();
	reader.onload = (e) => {
		const track = document.createElement("track");
		track.kind = "subtitles";
		track.label = "English";
		track.srclang = "en";
		track.src = URL.createObjectURL(new Blob([e.target.result], { type: "text/vtt" }));
		track.default = true;
		mainVideo.appendChild(track);
		mainVideo.textTracks[0].mode = "showing";
	};
	reader.readAsText(file);
};

subsMenu.querySelector(".load-subs").addEventListener("click", () => {
	subsInput.click();
});

subsInput.addEventListener("change", (e) => {
	const file = e.target.files[0];
	if (file) {
		loadSubtitleFile(file);
	}
});

// Add an event listener to the "no-subs" element
const noSubsButton = subsMenu.querySelector(".no-subs");
noSubsButton.addEventListener("click", () => {
    // Check if a subtitle track exists
    const existingTrack = mainVideo.querySelector("track[kind='subtitles']");
    if (existingTrack) {
        // Remove the existing subtitle track
        mainVideo.removeChild(existingTrack);
    }
})

fullscreenBtn.addEventListener("click", () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        container.requestFullscreen();
    }
});

document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        fullscreenBtn.innerText = "fullscreen_exit";
        mainVideo.classList.add("fullscreen");
    } else {
        fullscreenBtn.innerText = "fullscreen";
        mainVideo.classList.remove("fullscreen");
    }
});



replay.addEventListener("click", () => {
	mainVideo.currentTime -=5;
});

skip.addEventListener("click", () => {
	mainVideo.currentTime +=5;
});

playPauseBtn.addEventListener("click", () => {
	mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

mainVideo.addEventListener("play", () => {
    playPauseBtn.innerText = "pause";
});

mainVideo.addEventListener("pause", () => {
    playPauseBtn.innerText = "play_arrow";
});

document.addEventListener("keydown", e => {
    // Skip 5 seconds forward on right arrow key press
    if (e.key === "ArrowRight") {
        mainVideo.currentTime += 5;
    }
    // Skip 5 seconds back on left arrow key press
    else if (e.key === "ArrowLeft") {
        mainVideo.currentTime -= 5;
    }
    // Volume up on up arrow key press
    else if (e.key === "ArrowUp") {
        mainVideo.volume = Math.min(1, mainVideo.volume + 0.05);
        volumeSlider.value = mainVideo.volume;
    }
    // Volume down on down arrow key press
    else if (e.key === "ArrowDown") {
        mainVideo.volume = Math.max(0, mainVideo.volume - 0.05);
        volumeSlider.value = mainVideo.volume;
    }
    // Toggle mute on 'm' key press
    else if (e.key === "m") {
        mainVideo.muted = !mainVideo.muted;
        if (mainVideo.muted) {
            volumeBtn.innerText = "volume_off";
            volumeSlider.value = 0;
        } else {
            volumeBtn.innerText = "volume_up";
            volumeSlider.value = mainVideo.volume;
        }
		container.classList.add("show-controls");
		clearTimeout(timer);
		hideControls();
    }
    // Enable fullscreen on f key press
    else if (e.key === "f") {
        container.classList.add("fullscreen");
        fullscreenBtn.innerText = "fullscreen_exit";
		container.requestFullscreen();
    }
    // Toggle play/pause on spacebar key press
    else if (e.key === " ") {
        mainVideo.paused ? mainVideo.play() : mainVideo.pause();
		container.classList.add("show-controls");
		clearTimeout(timer);
		hideControls();
    }
});
