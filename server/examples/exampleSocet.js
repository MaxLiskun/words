const { createServer, get } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173"//указать адрес хоста vue
  }})

io.on("connection", (socket) => {
  console.log(' socket io)) user is connected')

  socket.on('someMessage', (msg) => {
    console.log('message: ' + msg);

    // Отправляем ответное сообщение обратно клиенту
    io.emit('chat message', 'хо хох охххххх');
  });

});

httpServer.listen(3001);