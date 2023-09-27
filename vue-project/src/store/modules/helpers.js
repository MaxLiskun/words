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
//----------------------------------------------------------------
export function checkWord(word) {
  word = word.trim();
  // if (word === "") {
  //   return { isValid: false, message: "Заповни поле" };
  // }

  if (/\d/.test(word.trim())) {
    return { isValid: false, message: "Заповни без цифр" };
  }

  if (/[^a-zA-Z0-9]/.test(word.replace(/\s+/g, ""))) {
    // ігнорує пробіли
    return { isValid: false, message: "Некоректна мова чи присутні символи" };
  }

  return { isValid: true, message: "Все добре)", word: word };
}
//----------------------------------------------------------------
export function checkUkrainianAndTranscriptionWord(word) {
  const ukrainianPattern = /^[\u0410-\u044f\u0406\u0456\u0407\u0457\u0490\u0491]+$/;
  word = word.trim();

  // if (word === "") {
  //   return { isValid: false, message: "Поле порожнє" };
  // }
  if (/[^а-яА-ЯҐґЄєІіЇї\s]/.test(word)) {//дозволяе пробіли і укр мову
    return { isValid: false, message: "Некоректна мова чи присутні символи" };
  }

  if (/\d/.test(word.trim())) {
    return { isValid: false, message: "Заповни без цифр" };
  }
  

  if (ukrainianPattern.test(word.toUpperCase())) {
    return { isValid: true, message: "Все добре", word: word };
  }
  
 return { isValid: true, message: "Все добре", word: word };
}

//----------------------------------------------------------------




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