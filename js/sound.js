// Stolen from blackout-bunny:
// https://github.com/una/blackout-bunny/blob/master/src/util/sound.js
var AudioContext = window.AudioContext || window.webkitAudioContext,

    buffers = {},
    context = new AudioContext(),
    nowPlaying,
    currentMusic;

function loadSound (url, next) {
	if (buffers[url]) {
		next();
		return;
	}

	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";

	request.onload = function() {
		// Asynchronously decode the audio file data in request.response
		context.decodeAudioData(
			request.response,
			function (buffer) {
				if (!buffer) {
					alert('error decoding file data: ' + url);
					return;
				}
				buffers[url] = buffer;
				next();
			},
			function(error) {
				console.error('decodeAudioData error', error);
			}
		);
	};

	request.onerror = function() {
		alert('BufferLoader: XHR error');
	}

	request.send();
};

function makeSource (url) {
	var source = context.createBufferSource();
	source.buffer = buffers[url];
	source.connect(context.destination);

	return source;
};

function playSound (url) {
	if (!buffers[url]) {
		loadSound(url, function () {
			playSound(url);
		});
		return;
	}

		makeSource(url).start(0);
};
