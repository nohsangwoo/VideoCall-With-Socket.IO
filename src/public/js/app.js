const socket = io();

const myFace = document.getElementById('myFace');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
const camerasSelect = document.getElementById('cameras');
const call = document.getElementById('call');

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;

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

// Welcome Form (join a room)

const welcome = document.getElementById('welcome');
const welcomeForm = welcome.querySelector('form');

// 방만들기 form에서 방이름 입력하고 방만들기 진행 한 후 작동하는 기능
// stream 뽑아와서 렌더링하고 기존 방만들기 관련(welcome부분) form hidden설정해서 안보이게 하고
// call hidden=false로 설정하여 나타나게 하기
async function initCall() {
  welcome.hidden = true;
  call.hidden = false;
  // myStream에 내 stream 데이터 뽑아온다
  await getMedia();
  // 방이 만들어지고 myStream도 잘 뽑아왔으면 peer연결을 위해 webrtc 초기 설정을 한다
  // myPeerConnection에 RTCPeerConnection객체 생성해서 저장한다.
  makeConnection();
}

// welcom form submit 진행시 이벤트 핸들링 함수
// 방을 만드는 peer A와 만들어진 방에 입장하는 peerB and c,d..들 모두 공통적으로 작동하는 부분
async function handleWelcomeSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector('input');
  //  stream데이터를 뽑아오고 화면에 렌더링 하는 부분들을 진행한다.
  // 이부분은 peerA와 peerB가 동시에 진행돼야하는 부분이라 socket.io의 done()으로 처리하지 않음
  await initCall();
  // 백엔드로 join_room이라는 트리거를 이용하여 신호를 보낸다
  // 이때 전해지는 데이터는 input.value(방이름)이다
  socket.emit('join_room', input.value);
  // rommName변수에 welcom form 의 input 태그에서 입력받은 값을 할당한다.
  roomName = input.value;
  // 위 작업이 모두 끝나면 welcome form의 input.value를 빈 문자열로 할당해준다(초기화)
  input.value = '';
}

// welcom form submit 진행시 이벤트 핸들링
welcomeForm.addEventListener('submit', handleWelcomeSubmit);

// Socket Code
// 백엔드로부터 welcome트리거를 건드리는 신호를 받으면 작동하는 부분
// 로직상 백엔드에서 방이 성공적으로 만들어진 이후에 작동하게 설계됐다
socket.on('welcome', async () => {
  // 다른 사용자가 접속했다면 offer생성하고 내 연결정보(offer)를 생성한다.
  const offer = await myPeerConnection.createOffer();
  // offer정보를 백엔드로 전달하기위한 코드
  myPeerConnection.setLocalDescription(offer);
  console.log('sent the offer');
  socket.emit('offer', offer, roomName);
});

// 기존에 존재하는 방에 접속했을때
// 기존의 방에 접속하는 유저들의 offer정보를 전달받음
// peer B의 동작(기존 존재하는 방에 새로 접속한 유저)
socket.on('offer', async offer => {
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);

  socket.emit('answer', answer, roomName);
});

// 방에 새로 접속한 유저를 제외한 모든 유저가 전달 받음
socket.on('answer', answer => {
  myPeerConnection.setRemoteDescription(answer);
});

// RTC Code (WebRTC를 제어하는 부분)

function makeConnection() {
  myPeerConnection = new RTCPeerConnection();
  myStream
    .getTracks()
    .forEach(track => myPeerConnection.addTrack(track, myStream));
}
