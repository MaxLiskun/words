const fs = require('fs')
const path = require('path')
const googleTTS = require('google-tts-api')
//https://www.npmjs.com/package/google-tts-api



const getLongBinaryAudio = async (req, res) => {
  //long text
  try {
    const data = req.body.data;
    const language = req.body.language

    const audioChunks = await googleTTS.getAllAudioBase64(data, {
      lang: language,
      slow: false,
      host: "https://translate.google.com",
      timeout: 10000,
      splitPunct: ",.?",
    });
    const binaryAudio = Buffer.concat(
      audioChunks.map((chunk) => Buffer.from(chunk.base64, "base64"))
    );
    res
      .status(200)
      .json({ message: "googleTTS - виконано успішно", binaryAudio });
  } catch (error) {
    res.status(500).json({ message: "googleTTS - помилка при обробці запиту" });
  }
};



const getShortBinaryAudio = async (req, res) => {
  try {
    //short text
    const data = req.body.data;
    const language = req.body.language

    const response = await googleTTS.getAudioBase64(data, {
      lang: language,
      slow: false,
      host: "https://translate.google.com",
      timeout: 10000,
    });
    const binaryAudio = await Buffer.from(response, "base64");
    res
      .status(200)
      .json({ message: "googleTTS - виконано успішно", binaryAudio });
    //==Для збереження)))
    // const fileName = `audio_${Date.now()}.mp3`;
    // const filePath = path.join(__dirname, "../audio", fileName);
    // fs.writeFileSync(filePath, binaryAudio);
  } catch (error) {
    res.status(500).json({ message: "googleTTS - помилка при обробці запиту" });
  }
 
}

const getAudioPath = (req, res) => {
    const fileName = req.params.filename;
    console.log(fileName)
    const filePath = path.join(__dirname, '../audio', fileName); // Укажите правильный путь к аудиофайлам на сервере
    res.sendFile(filePath);
}

    module.exports = {
      getLongBinaryAudio,
      getShortBinaryAudio,
      getAudioPath
    }