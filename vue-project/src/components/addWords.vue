<template>
    <div class="addWords">
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




        <div class="blocs-container">

            <div class="english-block">
                <div class="english_block__input">
                    <input type="text" placeholder="inEnglish" v-model="inEnglish" > 
                    <span class="checked-fill" v-if="enIsValidField && inEnglish.length"> <span class="material-symbols-outlined">check_circle</span></span>
                    <span class="cancel-fill" v-if="enIsValidField === false && inEnglish.length"> <span class="material-symbols-outlined">cancel</span></span>   
                    
                    <span class="play-audio-button material-symbols-outlined" 
                    :class="{ 'play-animation': isPlayingNow }"
                    @click="playThis(inEnglish, 'en')">volume_up</span>  
                    
                    <div class="enIsValidMessage">{{ enIsValidMessage }}</div> <br>

                   
                </div>
            
                <div class="suggestion-container">
                    <div class="englishSuggestions" v-for="suggestion in enSuggestions">
                        <span @click="clickEnSuggestion(suggestion) "> <div class="some">{{ suggestion }}</div></span>
                     </div>
                </div>
            
            
                
  

             

            </div>
            
            <div class="ukrainian-block">
                <input type="text" placeholder="InUkrainian" v-model="inUkrainian">
            </div>
            
                            

            <div class="InTranscription-block">
                <input type="text" placeholder="InTranscription" v-model="inTranscription">
                {{ getWordsMessage }}{{ errorMessage }}
            </div>
             

                <button @click="sendData(inEnglish, inUkrainian, inTranscription)">Зберегти</button>


            </div>

       
      

       


    </div>

      
               
    <RouterView />
</template>

<script>

import { RouterLink, RouterView } from 'vue-router'
import categoryList from '../components/categoryList.vue'
import { checkWord } from '../store/modules/helpers'
import { socket } from "../socket"
import {playLongAudio, playShortAudio} from '../store/modules/helpers'



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

            
            isPlayingNow: null,


            enSuggestions: [],
            enIsValidMessage: '',
            enIsValidField: false,
        }
    },
   


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
            //console.log(word)
            this.inEnglish = word
            this.enSuggestions = []

        },
     
   async  playThis(data, language){
      
    try {
    this.isPlayingNow = true  
    await playLongAudio(data, language);
    this.isPlayingNow   = false
  } catch (error) {
    console.error('Ошибка воспроизведения аудио:', error);
  }

     
  



    
        },

    },
    




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
        getEnSuggestion() {
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

        inEnglish(newValue) {
           // console.log(newValue)
            const isValid = checkWord(newValue).isValid
            this.enIsValidField = isValid
            const isValidMessage = checkWord(newValue).message
            this.enIsValidMessage = isValidMessage
            if (isValid) {
                socket.emit('someMessage', newValue)// визиваем функцию someMessage
                socket.on('enSuggestions', (enSuggestions) => {this.enSuggestions = enSuggestions})
            } else {
                console.log('Слово не валідне')
            }
        }
    }
}


</script>

<style lang="scss">

//@import '../../src/styles/playButton.scss';

.suggestion-container{

    display: flex;
    width: 100%;
    height: 100%;
   gap: 10px;
flex-grow: 0;
flex-wrap: wrap;
   
    margin: 5px;
}
.some{
    display: block;
    border: 1px solid black;
    padding: 0px 7px;
    border-radius: 4px;
    
}
.some:hover{
    background-color: #f1e6e6;
    cursor: pointer;

}
.blocs-container{
    width: 100%;
    display: block;
}


input{
    border: 1px solid grey;
    border-radius: 4px;
    box-shadow: 0px 1px 5px grey;
    min-height: 20px;
    width: 100%;

}
input:focus{
    border: 2px solid #da0a0a;
}
.english_block__input{
    display: flex; 
}
.checked-fill{
    display: block;
    color: rgb(54, 199, 54);

}
.cancel-fill{
    display: block;
    color: red;
}



</style>


