# Video Call With Socket.IO

- Socket.IO를 사용하여 간단한 비디오 통화 앱 구현
  (이 프로젝트는 #3 부터 시작되는 내용)

## 0.2 server setup

    1) nodemon
    - npm install nodemon
    - 코드 변경사항이 있으면 자동으로 감지하고 서버를 재시작해줌
    - nodemon.json에 nodemon 설정파일에 설정사항 작성
    - package에서 nodemon실행 스크립트 작성 후 nodemon.json에서 실행하는 설정명령어(exec) 로 실행됨
    - exec 옵션은 "babel-node src/server.js" 값을 가지는데 해당의미는 babel-node를 이용하여 src디렉토리의 server.js를 실행시켜라 라는 의미
    - 이때 babel-node는 babel.config.json의 내용을 참고하여 해당 babel설정파일의 옵션을 기준으로 server.js를 실행한다.

    2) babel
    - npm install @babel/core @babel/cli @babel/node @babel/preset-env -D
    - 자바스크립트 최신문법을 사용할수있게 해준다(호환성)
    - babel.config.json에 config 사항 작성

    3) express
    - npm install express

    4) pug
    - npm install pug

# 0.3 front setup

- script파일 만들고 Pug파일에 첨부하는 방법
  app.use로 파일 경로를 지정하여 script파일을 사용하겠다 선언하고 pug파일에서 해당 js파일을 로드한다

- nodemon ignore setting
  ignore에 들어가는 경로는에서는 파일내용이 변경되도 서버가 재시작 안됨(nodemon의 감지를 무시하는 경로지정)

```
  "ignore": ["src/public/*"],
  <!-- src하위 디렉토리중 public디렉토리 안에 들어간 모든 파일과 폴더를 ingore옵션에 추가 -->
```

- nvp css 적용
  아주 간단한 정적 프로젝트 진행할때 css관련 내용을 간단히 대체하고 싶을때 사용
  https://andybrewer.github.io/mvp/

  npv css는 CDN을 제공한다. 적용법은 아래와 같다

```
<link rel="stylesheet" href="https://unpkg.com/mvp.css">
<!-- 위 내용을 pug 규칙에 맞춰 아래와같이 첨부한다 -->
link(rel="stylesheet", href="https://unpkg.com/mvp.css")
```

# 0.4 if client's try to connect to some other path then be redirection

## 3.0 User Video

- 비디오 연결을 위한 전체적인 간단한 기본 세팅

## 3.1 Call Controls

- 접속한 디바이스의 정보를 불러온다(카메라, 오디오 등...)
- 접속 디바이스의 장치를 제어한다(카메라 on/off, 오디오 on/off, 또는 연결 장치 변경 등...)
- 일단 현재 디바이스의 모든 카메라 정보를 불러오는 깅과, 카메라 on/off기능만 구현

## 3.2 Camera Switch

- 선택한 카메라 장치 아이디를 이용하여 사용 하는 카메라를 변경하고 적용한다.

## 3.4 Rooms

- socket.io 방만들고 만들어진 방에 참여하는 기능 구현

## 3.5 Offers

- webRTC연결을 위한 offer정보를 만들어서 전달하고 전달 받는 과정 구현

1. getUserMidea()
2. new RTCPeerConnection() // RTCPeerConnection객체 생성
3. (이때 myStream.getTracks()안에는 오디오트랙과 비디오 트랙정보가 담겨있는데 각각의 트랙에 위작업에서 생성한 RTCPeerConnection 객체를 연결한다.
4. addTrack() // 생성된 RTCPeerConnection객체에 track정보 추가
   (설정값등등..)
5. createOffer // 새로운 사용자가 내가 속한 방에 접속했다면 나와 연결하기 위한 정보를 해당 새로운 접속자에게 전달하기위해 생성된 RTCPeerConnection객체에 offer 생성한다.
6. setLocalDescription(); // 이후 RTCPeerConnection객체에 위에서 생성된 offer값을 참조하여 setLocalDescription설정한후 해당 offer정보를 백엔드로 전달하여 나 이외의 방안에있는 모든 접속자에게 내 offer정보를 전달한다.

## 3.6 Answers

- peerA의 offers정보를 받은 후 peerB에서 작업해야할 내용 진행

1. setRemoteDescription(peerA's offer);
2. createAnswer
3. setLocalDescription

- peer B의 위 작업이 끝나면 peer B의 answer정보를 peer A에서 받고 넘겨 받은 anserData로 setRemoteDescription(peerB's answer)처리 한다.

## 3.8 IceCandidate

- 연결에 필요한 여러 후보 정보들을 리스트 업할게되는데 이때 특정 candidate를 선택하고 이 방식으로 서로 통신하겠다 라고 peer간 협의가 완료되면 해당 방식으로 webrtc통신이 이루어진다

## 3.8 Senders (개중요함)

- sender는 상대방에게 보내지는 media Stream track을 컨트롤 할수있는 기능

- 로컬 환경의 webrtc stream은 변경되고있지만 다른유저에게 보내는 stream(new ()로 만들어지는 객체들)정보는 변경되지 않았기때문에 getSenders로 정보를 가져온다

- stream을 다시뽑아오는 경우 상대에게 보내는 stream도 변경되길 원할때 sender설정을 건드려야함

## 3.9 구글에서 제공하는 무료 stun 서버를 사용해서 접속 정보를 서로에게 전달할수있게 해줌

## datachannel 에 대해 알아보기 (이미지, 문서 등을 전달 하고 전달 받을 수 있음)

## 3.11 Data Channels

- p2p방식으로 파일을 전송하거나 텍스트를 직접 교환할수있는 방식
- 아주 쉬움

0. Peer A에서 무언가 offer하는 socket이 Data Channel을 생성하는 주체가 되어야 한다.
1. Peer A에서 데이터 채널을 생성하고

```
myDataChannel = myPeerConnection.createDataChannel("chat");
```

2. Peer B에서 Data Channel을 offer가 받아질때 같이 받는다

```
  myPeerConnection.addEventListener("datachannel", (event) => {
    myDataChannel = event.channel;
    myDataChannel.addEventListener("message", (event) =>
      console.log(event.data)
    );
  }
```

3. 이제 위 과정이 끝난 이후 Peer A쪽에서 데이터 채널을 사용하여 send로 보내면 실시간으로 전달이 가능하다.

```
ex)
myDataChannel.send("hello");
```

## 3.12 Code Challenge

Code Challenge
Improve the CSS
Make a Chat using Data Channels
When a peer leaves the room, remove the stream.
Send a link to your code on the comments!
