const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

let myStream;
let muted = false;
let cameraOff = false;

// 현재 디바이스에 연결된 모든 카메라 정보를 가져오는 기능
async function getCameras() {
  try {
    // 이함수의 코어
    const devices = await navigator.mediaDevices.enumerateDevices();

    // 현재 연결된 카메라 정보만 필터링해서를 불러와준다.
    // 같은방식으로 오디오정보도 뽑아올수있음
    const cameras = devices.filter((device) => device.kind === "videoinput");
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      camerasSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

// 내영상 뽑아와서 화면에 렌더링 하는 기능
async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    myFace.srcObject = myStream;
    await getCameras();
  } catch (e) {
    console.log(e);
  }
}

getMedia();

// 내영상에 연결된 오디로를 껐다 켰다 하는 기능
function handleMuteClick() {
  myStream.getAudioTracks().forEach((track) => {
    console.log("track: ", track);
    track.enabled = !track.enabled;
  });
  if (!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
}

// 실제 내 영상에서 연결된 카메라를 껐다 켰다 하는 기능
function handleCameraClick() {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Turn Camera On";
    cameraOff = true;
  }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
