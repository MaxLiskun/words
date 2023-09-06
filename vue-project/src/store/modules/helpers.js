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

if(word === ''){
  console.log('Ви не ввели слово')
  return false
}
if (/\d/.test(word.trim())) {
       console.log('тут є цифри')
       return false
   }

   if (/[^a-zA-Z0-9]/.test(word)) {
    console.log('Тут есть специальные символы');
    return false;
}
  console.log('Все добре')
  return true, word


  

}



export async function playAudio(data, language) {
 
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
      audioElement.play();
  } catch (error) {
      console.log('Помилка програвання аудіо', error);
  }
}