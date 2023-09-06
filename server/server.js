const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const keys = require('./keys')



app.use('/audio', express.static(path.join(__dirname, 'audio')));




const corsOptions = {
  origin: '*', // Разрешить доступ всем доменам
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json())


const translator = require('./googleTranslator/index')


//**socket.io**
const http = require('http'); // Добавьте эту строку
const server = http.createServer(app);
const initializeSocket = require('./socket');
server.listen(3001, () => {
  console.log('Socket server listening on 3001');
});
initializeSocket(server);
//**socket.io** end



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
const audioRouts = require('./routes/audioRouts')

//localhost:3000/api/auth/login
app.use('/api/auth', authRouts)
app.use('/api/user',tokenExpiredMiddleware, userInfo)
app.use('/api/category', category)
app.use('/api/words', words)


app.use('/api/audio', audioRouts)

const spell = require('spell-checker-js')
spell.load('en')
const check = spell.check('houe, dog, mother')
//console.log(check)






















