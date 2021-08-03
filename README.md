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

# 1.2 WebSockets in NodeJs

- nodejs용 websocket 라이브러리 설치
  npm install ws

# 1.3 WebSocket Events

- 프론트 접속하면 처음으로 백엔드로 소켓연결되게 설정

# 1.3 WebSocket Events

- websockets

# 1.4 WebSocket Messages

- socket에는 정해진 몇개의 트리거가 존재한다.
  (open,message,close,message)
  각각의 트리거에 해당하는 이벤트가 발생하면 어떤 작동을 할것인지 구현한다.

# 1.5 refactoring and fix some bugs

# 1.6 Chat Completed

- 프론트에서 message를 전달받으면 백엔드에서 현재 전달받은 메시지를 접속한 모든 유저에게 다시 전달해주는 작업 구현

# 1.7 Nicknames part One

- 프론트에서 백엔트로 데이터를 보낼때 데이터의 객체형식으로 보내는데 해당 메시지의 type과 내용을 보내서 type의 경우에 따라 다른 동작을하도록 설정
  (마치 redux처럼 처리)
- 프론트엔드에서 사용자의 닉네임 설정 처리

# 1.8 Nicknames part Two

- 백엔드에서 닉네임변경하는건지 메시지를 보내는건지 분기점에따라 switch문 처리한다.

# 2 Socket.IO

## 2.1 Installing Socket.IO

- socket.IO설치후 초기 세팅

## 2.2 Communication between Frontend and BackEnd using 'socket.IO'

## 2.3 be implement to finish function to done from backend

## 2.4 Rooms

- socket.IO에서 방 만들기

## 2.6 Room Notifications

## 2.7 Nicknames

- 누가 나갔는지, 누가 방에 접속했는지, 누가 보낸메시지인지 분별하기 쉽도록 nickname변수를 추가한다, 이후 사용자에게 nickname도 전달 받을수 있게 설정.
- 코드 챌린지 : 방입장전에 닉네임 입력 같이 받아서 입장하기
  (입장시 닉네임 입력 안받으면 Anon이라는 닉네임을 자동으로 부여받는다)

## 2.8 Room Count part One

- nodejs서버에서 현재 만들어진 방의 총 현황을 파악하기 위한 작업
- adapter
  ref: https://socket.io/docs/v4/adapter/
  adapter에서 socketIO에서 일어나는 여러 현황 확인 가능

근데.. 이게좀 불안정해서 nodejs에서 따로 배열만들어서 현황 유지하던가
DB연결해서 따로 현황 유지하던가.. 하는게 좋을듯.

## 2.9 Room Count part Two

- nodejs에서 만들어진 방의 총 현황을 확인했다면 해당내용을 frontend로 끌어와서 렌더링 해준다.
  방 만드는 첫화면에서(대기화면) 다른 클라이언트가 생성한 새로운 방이있으면 실시간으로 렌더링해주고 또한 방이 없어졌으면 실시간으로 없어진 방의 현황을 맞춰준다.

## 2.10 User Count

- 특정방에 접속해있는 유저의 수를 계산해서 표시해주는 기능

## 2.11 Admin Panel

- 만들어진 방 개수, 접속한 유저현황등을 표시해주는 admin 패널이다.
- https://socket.io/docs/v4/admin-ui/

- 사용법

1. https://admin.socket.io 으로 접속한다.

2. serverUrl을 `백엔드 서버 주소/admin` 를 입력해주고
   http://localhost:3000/admin

3. 맨 하단의 path부분을 비워주고 connect 클릭

## 3.0 User Video

- 비디오 연결을 위한 전체적인 간단한 기본 세팅
