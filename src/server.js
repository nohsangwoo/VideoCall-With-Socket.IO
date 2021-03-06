import http from "http";
import { Server } from "socket.io";
// import SocketIO from 'socket.io';
import { instrument } from "@socket.io/admin-ui";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);

const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(wsServer, {
  auth: false,
});

// const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    socket.join(roomName);

    // 현재 트리거를 날린 대상자를 제외하고 모든 방참여자에게 socket신호를 전달
    socket.to(roomName).emit("welcome");
  });
  // 방 생성이후 offer 트리거가 프론트로부터 날라오면 해당 정보를
  // 트리거를 보낸 사람 이외 방안의 모든 사람에게 다시 뿌려주는 기능
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });

  // 방에 새로 접속한 사람의 asnwer정보를 방안의 모든 유저에게 전달
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });

  // 프론트에서 전달받은 iceCandidate정보를 해당 방의 모든 사람에게 전달해줌
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
