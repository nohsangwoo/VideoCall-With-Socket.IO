const socket = io();

const myFace = document.getElementById('myFace');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
const camerasSelect = document.getElementById('cameras');

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
    const cameras = devices.filter(device => device.kind === 'videoinput');

    // 현재 사용되고있는 비디오 장치 정보를 가져온다
    const currentCamera = myStream.getVideoTracks()[0];

    cameras.forEach(camera => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.innerText = camera.label;

      // 알아낸 현재 카메라 장치정보의 label과
      // 리스트업된 카메라 장치정보중에 같은 라벨값이 같다면 selected 옵션을 부여한다
      // (default value 지정하는 부분임) 자동으로 현재 사용하고있는 카메라 라벨을 선택된 상태로 렌더링한다
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      camerasSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

// 내영상 뽑아와서 화면에 렌더링 하는 기능
async function getMedia(deviceId) {
  // stream불러올때 기본적인 오디오 비디오 설정값
  const initialConstrains = {
    audio: true,
    video: { facingMode: 'user' },
  };

  // 전달받은 카메라 장치 아이디가 있다면
  // 해당 아이디를 이용하여 기본값으로 지정해준다.
  const cameraConstraints = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    // 전달받은 camera 장치정보 아이디가 있는경우와 없는 경우에 따라서 stream 세팅값을 다르게 하여 불러오는 설정
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstrains
    );
    myFace.srcObject = myStream;

    // 전달받은 camara 장치 아이디가 없다면
    // 카메라 목록 리스트업하는 부분 실행하기
    // 카메라 장치 아이디가 없다는것은 처음 실행했다는 것(처음 브라우저에 접속했다는 것)을 의미한다
    if (!deviceId) {
      await getCameras();
    }
  } catch (e) {
    console.log(e);
  }
}

getMedia();

// 내영상에 연결된 오디로를 껐다 켰다 하는 기능
function handleMuteClick() {
  myStream.getAudioTracks().forEach(track => {
    console.log('track: ', track);
    track.enabled = !track.enabled;
  });
  if (!muted) {
    muteBtn.innerText = 'Unmute';
    muted = true;
  } else {
    muteBtn.innerText = 'Mute';
    muted = false;
  }
}

// 실제 내 영상에서 연결된 카메라를 껐다 켰다 하는 기능
function handleCameraClick() {
  myStream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraBtn.innerText = 'Turn Camera Off';
    cameraOff = false;
  } else {
    cameraBtn.innerText = 'Turn Camera On';
    cameraOff = true;
  }
}

async function handleCameraChange() {
  await getMedia(camerasSelect.value);
}

muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);
camerasSelect.addEventListener('input', handleCameraChange);
