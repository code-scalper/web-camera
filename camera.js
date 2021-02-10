// dom
const recordButton = document.querySelector(".record-button");
const stopButton = document.querySelector(".stop-button");
const playButton = document.querySelector(".play-button");
const downloadButton = document.querySelector(".download-button");
const previewPlayer = document.querySelector("#preview");
const recordingPlayer = document.querySelector("#recording");

// setting
const recordingDuration = 15;
let recorder;
let recordedChunks;

// functions
function videoStart() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      previewPlayer.srcObject = stream;
      startRecording(
        previewPlayer.captureStream() || previewPlayer.mozCaptureStream()
      );
    });
}
function startRecording(stream) {
  recordedChunks = [];
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => recordedChunks.push(e.data);
  recorder.start();
}
function stopRecording() {
  previewPlayer.srcObject.getTracks().forEach((track) => track.stop());
  recorder.stop();
}

function playRecording() {
  const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
  recordingPlayer.src = URL.createObjectURL(recordedBlob);
  recordingPlayer.play();
  downloadButton.href = recordingPlayer.src;
  downloadButton.download = `recording_${new Date()}.webm`;
}

// event
recordButton.addEventListener("click", videoStart);
stopButton.addEventListener("click", stopRecording);
playButton.addEventListener("click", playRecording);

/* button ui */
const buttons = document.querySelectorAll(".button-container > button");

function setActive() {
  const activeButton = document.querySelector(".active");
  if (activeButton) {
    activeButton.classList.remove("active");
  }
  this.classList.add("active");
}

buttons.forEach((button) => button.addEventListener("click", setActive));
