
const { GoogleTTS }=require('@translate-tools/core/tts/GoogleTTS');
const fs = require('fs')
const path = require('path')

const googleTTS = require('google-tts-api')



const saveAudio = async (req, res) => {
  //short text
//   const data = req.body.data
//   const response = await googleTTS.getAudioBase64(data, {
//     lang: "en",
//     slow: false,
//     host: "https://translate.google.com",
//     timeout: 10000,
//   });
//   // Преобразование base64 в бинарные данные
//   const binaryAudio = await Buffer.from(response, "base64");


//   //==Для сохранения если нужно)))
//   // const fileName = `audio_${Date.now()}.mp3`;
//   // const filePath = path.join(__dirname, "../audio", fileName);
//   // fs.writeFileSync(filePath, binaryAudio);
//  //End ==Для сохранения если нужно )))


//   res.status(200).json({ message: "Аудио успешно сохранено", binaryAudio });



////////////////////////////////////////////////////
  //long text

 const data = req.body.data

  const audioChunks = await googleTTS.getAllAudioBase64(data,{
    lang: 'en',
    slow: false,
    host: 'https://translate.google.com',
    timeout: 10000,
    splitPunct: ',.?',
  })
  const binaryAudio = Buffer.concat(audioChunks.map(chunk => Buffer.from(chunk.base64, 'base64')));


  // const fileName = `audio_${Date.now()}.mp3`;
  // const filePath = path.join(__dirname, "../audio", fileName);
  // fs.writeFileSync(filePath, allAudioData);

  res.status(200).json({ message: "Аудио успешно сохранено", binaryAudio });


};




const getAudioPath = (req, res) => {
    const fileName = req.params.filename;
    console.log(fileName)
    const filePath = path.join(__dirname, '../audio', fileName); // Укажите правильный путь к аудиофайлам на сервере
    res.sendFile(filePath);
}


  










    module.exports = {
        saveAudio,
        getAudioPath
    }