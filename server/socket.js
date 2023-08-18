
const { createServer } = require("http");
const { Server } = require("socket.io");
const {enSuggestions} = require("./nodehun/index")



function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173" //указать адрес хоста vue
    }
  });

  io.on("connection", (socket) => {
    console.log('socket io)) user is connected');

    socket.on('someMessage', (msg) => {
        enSuggestions(msg)
      console.log('message: ' + msg);
      io.emit('chat message', 'хо хох охххххх');
    });
  });
}

module.exports = initializeSocket;