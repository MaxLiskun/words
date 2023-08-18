const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')


// const spell = require('spell-checker-js')
// spell.load('en')
// const check = spell.check('houe, dog, mother')
// console.log(check)

//clg


const User = require('./models/User')
const keys = require('./keys')
app.use(cors())
app.use(express.json())
/////////////////////////////////////////////


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





///////////////////////////////////
app.listen('3000', ()=>{
  console.log('listening on 3000')
})

mongoose.connect(keys.myDb)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));












const tokenExpiredMiddleware = require('./middleware/tokenExpiredMiddleware')




const authRouts = require('./routes/authRouts')
const userInfo = require('./routes/userInfoRouts')

const category = require('./routes/categoryRouts')
const words = require('./routes/wordsRouts')



//localhost:3000/api/auth/login
app.use('/api/auth', authRouts)
app.use('/api/user',tokenExpiredMiddleware, userInfo)

app.use('/api/category', category)

app.use('/api/words', words)
























