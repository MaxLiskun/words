import axios from 'axios'
import keys from '../../keys'


export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds);

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function formatDate(){
const currentDate = new Date();

const day = currentDate.getDate().toString().padStart(2, '0');
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed, so we add 1
const year = currentDate.getFullYear();

const formattedDate = `${day}.${month}.${year}`;
return formattedDate
}

export function checkWord(word) {
  word = word.trim();
  if (word === "") {
    return { isValid: false, message: "Упс( Тут порожньо" };
  }
  if (/\d/.test(word.trim())) {
    return { isValid: false, message: "Упс( Заповни без цифр" };
  }

  if (/[^a-zA-Z0-9]/.test(word)) {
    return { isValid: false, message: "Упс( Заповни без спеціальних знаків" };
  }
  return { isValid: true, message: "Все добре)", word: word };
}



// data - ето текст для озвучки, language - 'en', 'ru', 'uk'
export async function playLongAudio(data, language, isEnd) {
 
  try {
      const saveAudioResponse = await axios.post(`${keys.host}/api/audio/getLongBinaryAudio`,
          {
              data: data,
              language: language,//uk,en,ru
          })
      const dataFrom = saveAudioResponse.data.binaryAudio.data
      // Шаг 2: Преобразуйте массив в Uint8Array
      const uint8Array = new Uint8Array(dataFrom);
      // Шаг 3: Создайте Blob из Uint8Array
      const blobData = new Blob([uint8Array], { type: 'audio/mp3' });
      // Шаг 4: Создайте URL для Blob
      const audioUrl = URL.createObjectURL(blobData);
      const audioElement = new Audio(audioUrl);

      // Сохраните isEnd в локальной переменной
 

      audioElement.play();

      const audioEndedPromise = new Promise((resolve) => {
        audioElement.addEventListener('ended', () => {
          resolve(); // Разрешить обещание после окончания аудио
          
        });
      });
      return audioEndedPromise
  } catch (error) {
      console.log('Помилка програвання аудіо', error);
  }
}

// data - ето текст для озвучки, language - 'en', 'ru', 'uk'
export async function playShortAudio(data, language) {
 
  try {
      const saveAudioResponse = await axios.post(`${keys.host}/api/audio/getShortBinaryAudio`,
          {
              data: data,
              language: language,//uk,en,ru
          })
      const dataFrom = saveAudioResponse.data.binaryAudio.data
      // Шаг 2: Преобразуйте массив в Uint8Array
      const uint8Array = new Uint8Array(dataFrom);
      // Шаг 3: Создайте Blob из Uint8Array
      const blobData = new Blob([uint8Array], { type: 'audio/mp3' });
      // Шаг 4: Создайте URL для Blob
      const audioUrl = URL.createObjectURL(blobData);
      const audioElement = new Audio(audioUrl);
      audioElement.play();
  } catch (error) {
      console.log('Помилка програвання аудіо', error);
  }
}