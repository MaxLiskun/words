<template>
    <div>
        <hr>
        <hr>
        <router-link class="router-link" to="/">Home</router-link> <br>
        <h3>addWords</h3>

        <categoryList v-model="selectedCategory" @category-change="getCategory">
            <template v-slot:categoryLabel>

                <span v-if="getAddWordsSelectedCategory === null && getCategories.length">
                    <span>обери категорію </span>
                    ({{ getCategories.length }})
                </span>

                <span v-if="getCategories.length <= null">Немає категорій</span>

                <div v-if="getAddWordsSelectedCategory">
                    <span>{{ getAddWordsCategoryLabel.name }}</span>
                    <span> ({{ getAddWordsCategoryLabel.wordCount }})</span>
                </div>



            </template>
        </categoryList>




        <div class="words-container">

            <input type="text" placeholder="inEnglish" v-model="inEnglish" > 

         
                  
            <div class="englishSuggestions" v-for="suggestion in enSuggestions">
                    <span @click="clickEnSuggestion(suggestion)">{{ suggestion }}</span>
                    </div>
            
            
                    <input type="text" placeholder="InUkrainian" v-model="inUkrainian">


            <input type="text" placeholder="InTranscription" v-model="inTranscription"><br>
            {{ getWordsMessage }}{{ errorMessage }}
            <button @click="sendData(inEnglish, inUkrainian, inTranscription)">Зберегти</button>


        </div>

       
      
        <button @click="playSome">Play Some</button>

        <div>
       <audio controls :src="audioUrl"></audio>
            </div>


    </div>


    <RouterView />
</template>

<script>
import { GoogleTTS } from '@translate-tools/core/tts/GoogleTTS';
import { RouterLink, RouterView } from 'vue-router'
import categoryList from '../components/categoryList.vue'
import { checkWord } from '../store/modules/helpers'
import axios from "axios";
import { socket } from "../socket"
import keys from "../keys";

//import io from 'socket.io-client';


export default {
    name: 'addWords',
    components: {
        categoryList
    },

    data() {
        return {
            inEnglish: '',
            inTranscription: '',
            inUkrainian: '',
        

            errorMessage: '',
            selectedCategory: null,
            suggestions: [],

            URL: '',
            socket: null,


            enSuggestions: [],
            audioUrl: '', // Update the URL accordingly
        }
    },
   


//     created() {
//     // Подключение к серверу через сокет
//     this.socket = io('http://localhost:3001');

    
//   },

    methods: {


        

        async getCategory(category) {
            const selectCategory = await this.getCategories.find(el => el.categoryId === category.categoryId)
            await this.$store.commit('makeAddWordsSelectedCategory', selectCategory)
            await this.$store.commit('makeAddWordsCategoryLabel', selectCategory)
        },


        async sendData(inEnglish, inUkrainian, inTranscription) {
            const category = await this.$store.getters['getAddWordsSelectedCategory']

            if (category) {

                if (category.categoryId) {
                    const categoryId = await category.categoryId
                    await this.$store.dispatch('sendWords', { inEnglish, inUkrainian, inTranscription, categoryId, category })
                    if (this.getWordsMessage === 'Слово додане)))') {
                        setTimeout(() => (this.inEnglish = this.inUkrainian = this.inTranscription = ''), 200)
                        await this.$store.dispatch('getCategories')
                        const selectCategory = await this.getCategories.find(el => el.categoryId === category.categoryId)
                        await this.getCategory(selectCategory)
                        //додае слово в wordList якщо там відкрито
                        if (this.$store.getters['getWordListSelectedCategory']) {
                            this.$store.dispatch('getUserWords', this.$store.getters['getWordListSelectedCategory'])
                        }
                    }
                } else {
                    this.errorMessage = 'Спочатку оберіть категорію'
                    setTimeout(() => (this.errorMessage = ''), 1000)
                    return
                }
            } else {
                this.errorMessage = 'Спочатку оберіть категорію'
                setTimeout(() => (this.errorMessage = ''), 1000)
                return
            }

        },

        clickEnSuggestion(word){
            console.log(word)
            this.inEnglish = word
            this.enSuggestions = []

        },
     
      
      
        async playAudio(data) {

            try {
                //сохраняем аудио
                const saveAudio = await axios.post(`${keys.host}/api/audio/save-audio`, { data: data });
                const saveAudioFileName = saveAudio.data.fileName
                console.log(saveAudioFileName)


                const respon = await axios.get(`${keys.host}/api/audio/get-audio/${saveAudioFileName}`, {
                    responseType: 'blob' // Указываем, что ожидаем получить двоичные данные (blob)
                });

                
                const blob = respon.data;
                const audio = new Audio(URL.createObjectURL(blob));
                 await audio.play()
               
               
            } catch (error) {
                console.error('Error playing audio:', error);
            }
        },

        async playSome() {
        const data = this.inEnglish

             try {
        const saveAudioResponse = await axios.post(`${keys.host}/api/audio/save-audio`, {data});
console.log(saveAudioResponse.data.binaryAudio.data)
const dataFrom = saveAudioResponse.data.binaryAudio.data

// Шаг 2: Преобразуйте массив в Uint8Array
const uint8Array = new Uint8Array(dataFrom);
console.log(uint8Array)

// Шаг 3: Создайте Blob из Uint8Array
const blobData = new Blob([uint8Array], { type: 'audio/mp3' });
console.log(blobData)

// Шаг 4: Создайте URL для Blob
const audioUrl = URL.createObjectURL(blobData);
console.log(audioUrl)
const audioElement = new Audio(audioUrl);
this.audioUrl = audioUrl
audioElement.play();

    } catch (error) {
        console.error('Error playing audio:', error);
    }
},

    },
    
    //================================================================



    //================================================================




    computed: {
        getWordsMessage() {
            return this.$store.getters['getMessage']
        },
        getAddWordsCategoryLabel() {
            return this.$store.getters['getAddWordsCategoryLabel']
        },

        getCategories() {
            return this.$store.getters['stateCategories']
        },

        getAddWordsSelectedCategory() {
            return this.$store.getters['getAddWordsSelectedCategory']
        },
        getEnSuggestion(){
            return this.$store.getters['getEnSuggestion']
        },

        connect() {
      socket.connect();
    },
    

    




    },
    mounted() {
        this.$store.dispatch('getCategories')
    
    },


    watch: {

        getCategories: {
            handler(categoryChange) {
                if (this.getAddWordsSelectedCategory) {
                    const category = categoryChange.filter(element => element.categoryId === this.getAddWordsSelectedCategory.categoryId)
                    this.$store.commit('makeAddWordsCategoryLabel', category[0])
                    
                }

            },
            deep: true
        },

        inEnglish(newValue){
         console.log(newValue)
         const isValid = checkWord(newValue)

         if(isValid){
            console.log('Слово валідне', newValue)
           // this.$store.dispatch('checkWord', newValue)
           
            socket.emit('someMessage', newValue)// визиваем функцию someMessage
            socket.on('enSuggestions', (enSuggestions)=>{
                console.log(enSuggestions)
                this.enSuggestions = enSuggestions
        
            })

            //this.playAudio(this.inEnglish)
    
         }else{
            console.log('Слово не валідне')
       
     

         }
          
        }

    }

}


</script>




