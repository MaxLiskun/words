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

     <div class="en-block">
             <div class="en-block__container block-container">
                        
                            <div class="en-block__1">
                                <input   class="en-block__input addWords-input" @blur="inputNotActive" @focus="inputISActive" id="en-block__label" type="text" required v-model="inEnglish" >
                                <label   for="  en-block__label addWords-label">enEnglish</label> 
                                <span    class="en-block__decoration addWords-decoration"></span>
                            </div>


                            <div class="en-block__2">
                                <span class="check-icon   material-symbols-sharp"
                                :class="{'active': enIsValidField}"
                                >check_circle</span
                                >
                                <span class="cancel-icon  material-symbols-sharp"
                                :class="{'active': !enIsValidField && inEnglish.length}"
                                >cancel</span>
                            </div>
                            

                            <div class="en-block__3">
                                <span class="play-icon   material-symbols-outlined"
                                :class="{'play-animation': isPlayingNow}"
                                @click="playThis(inEnglish, 'en')">volume_up</span>   
                            </div>

                            <div class="en-block__4">
                                <div class="message">{{ enIsValidMessage }}</div>
                            </div>
                                  
                            <div class="en-block__5">
                                
                <div class="suggestion" v-for="suggestion in enSuggestions" @click="clickEnSuggestion(suggestion)">
                    
                    {{ suggestion }}
                
                </div>
                            </div>

            </div>
                  


                    
                  
               </div>
                  
                <!--ukrainaian-->
                <div class="uk-block">
                    <div class="uk-block__container block-container">
                        <input class="uk-block__input addWords-input" type="text" required id="uk-input" v-model="inUkrainian">
                        <label class="uk-block__label addWords-label" for="uk-input">inUkrainian</label>
                        <span  class="uk-block__decoration addWords-decoration"></span>
                    </div>
                </div>
                            
                    <!--transcription-->
            <div class="tr-block">
                <div class="tr-block__container block-container">
                   <input class="tr-block__input addWords-input" type="text" required id="tr-input" v-model="inTranscription">
                   <label class="tr-block__input addWords-label" for="tr-input">inTranscription</label>
                   <span  class="tr-block__decoration addWords-decoration"></span>
                </div>
            </div>


            <!--  -->
            {{ getWordsMessage }}{{ errorMessage }}
            <button @click="sendData(inEnglish, inUkrainian, inTranscription)">Зберегти</button>
            <!--  -->

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


            enInputTrigger: false,
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
        clickEnSuggestion(word) {
            this.inEnglish = word
           
            //this.enSuggestions = []
           

        },

        async playThis(data, language) {

            try {
                this.isPlayingNow = true
                await playLongAudio(data, language);
                this.isPlayingNow = false
            } catch (error) {
                console.error('Ошибка воспроизведения аудио:', error);
            }
        },

        inputNotActive() {
            this.enIsValidMessage = ''
        this.enInputTrigger = false
     
        setTimeout(()=>{this.enSuggestions = []},500)
       
        },


        inputISActive(){
        this.enInputTrigger = true
        }

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
            console.log(this.enIsValidField)
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
$check-icon-color: rgb(0, 255, 64);
$cancel-icon-color: rgb(249, 22, 22);




.english-block-container{
    //border: 1px solid black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    max-width: 320px;
    overflow: hidden;
    
    
    .english-block-1-input{
       
    display: flex;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    padding: 25px 10px 0px 10px ;
    
    }
    
    
        .check-icon{
        color: $check-icon-color;
        display: none;
        
        }
        .cancel-icon{
    
        color:$cancel-icon-color;
        display: none;
        }
        .active{
        display: block;
        }
    
    .group{
    position: relative;
    width: 100%;
    flex: 0 1 70%;
    
        input{
            width: 100%;
            display: block;
            border: none;
            border-bottom: 1px solid rgb(218, 209, 209);
            padding: 0;
        
                    &:focus{
                    outline: none;
                    }
    
                    
                    &:focus~label{
                    top: -20px;
                    transition: 0.2s ease all;
                    opacity: 0.5;
                    }  
    
                    &:focus~.bar:before{
                        width: 50%
                    }
                    &:focus~.bar:after{
                        width: 50%
                    }
                   
                    &:valid ~ label{
                        top: -20px;
                        opacity: 0.5;
                    } 
                   
        }
    
    label{
    position: absolute;
    top: -2px;
    transition: 0.2s ease all;
    opacity: 0.9;
    
    }
    
    .bar{
        position: relative;
        display: block;
        width: 100%;
        background-color: rgb(9, 252, 82);
    
            &::before{
                content: ' ';
                position: absolute;
                height: 1px;
                background-color: rgb(86, 86, 87);
                width: 0px;
                left: 50%;
                bottom: 0;
                transition: all .2s ease;
            }
            &::after{
                content: ' ';
                position: absolute;
                background-color: rgb(86, 86, 87);
                height: 1px;
                right: 50%;
                width: 0px;
                bottom: 0;
                transition: all .2s ease;
            }
     }
    
    }
    
    
    
    
    
       
    }
    
    .english-block-2-message{
        display: flex;
        
        align-items: center;
        width: 100%;
        font-size: 0.5rem;
        justify-content: flex-start;
        padding: 0px 10px;
        
    }
    
    
    .english-block-3-suggestion{
    
     
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        gap: 10px;
        color: rgb(158, 155, 155);
        padding: 5px 10px;
       
        
        .suggestion{
            border: 1px solid grey;
            border-radius: 3px;
            padding: 1px 10px;
            box-shadow: 0px 0px 3px rgb(170, 169, 169);
         &:hover{
            color: rgb(1, 1, 1);
            box-shadow: 0px 0px 3px rgb(100, 99, 99);
            cursor: pointer;
         }
        }
       
      
        
        
    } 
    




   
  
    

    

///////////////////////////////////////////////////////////////


.block-container {
   
    position: relative;
    padding: 25px 10px 10px 10px ;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    max-width: 320px;
    overflow: hidden;
    margin-top: 40px;
}
.addWords-label{
    position: absolute;
    top: 20px;
    opacity: 0.9;
    transition: all .2s ease;
   

}
.addWords-input {
    width: 100%;
    display: block;
    border: none;
    border-bottom: 1px solid rgb(218, 209, 209);
    padding: 0;
    

            &:focus ~ .addWords-label{
            top: 0px;
            opacity: 0.4;
            transition: all 0.2s ease;
            }

            &:focus{
                outline: none;
            }
            &:valid ~ .addWords-label{
                top: 0px;
            }
            &:focus~.addWords-decoration:before{
                width: 50%
            }
            &:focus~.addWords-decoration:after{
                width: 50%
            }
}




.addWords-decoration {
    position: relative;
    display: block;
    width: 100%;


        &::before{
            content: '';
            position: absolute;
            height: 1px;
            background-color: rgb(86, 86, 87);
            width: 0px;
            left: 50%;
            bottom: 0;
            transition: all .2s ease;
        }
        &::after{
            content: '';
            position: absolute;
            background-color: rgb(86, 86, 87);
            height: 1px;
            right: 50%;
            width: 0px;
            bottom: 0;
            transition: all .2s ease;
        }
}



</style>


