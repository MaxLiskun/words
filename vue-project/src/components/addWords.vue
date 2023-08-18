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
                    <div class="englishSuggestions" v-for="suggestion in getEnSuggestion">
                    <span>{{ suggestion }}</span>
                    </div>
            <input type="text" placeholder="InUkrainian" v-model="inUkrainian">
            <input type="text" placeholder="InTranscription" v-model="inTranscription"><br>
            {{ getWordsMessage }}{{ errorMessage }}
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
           
            socket.emit('someMessage', newValue)
            socket.on('chat message', (msg)=>{
                console.log(msg)
            })


    
         }else{
            console.log('Слово не валідне')
         }
          
        }

    }

}


</script>




