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
