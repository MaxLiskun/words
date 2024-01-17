<template>
    <div class="addWords">
      




        



<div class="addWords-container"  v-on:keyup.enter="sendData(inEnglish.toLowerCase(), inUkrainian.toLowerCase(), inTranscription.toLowerCase())" >
<addCategory/> 

    <categoryList v-model="selectedCategory" @category-change="getCategory" 
    :isNotSelected="categoryIsNotSelected"  
>
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


                        <!-- english -->
                        <div class="en-block">
                                            <!-- input -->
                                                <div class="en-block__input-container  input-container">
                                                    <input ref="enInput" class="en-block__input  input__1" :class="{'decorationIsActive': enIsValid}" @blur="enInputNotActive" @focus="enInputISActive" id="en-input" type="text" required v-model="inEnglish" >
                                                    <label class="en-block__label  label__1" for="en-input">enEnglish</label> 
                                                    <span :class="{'active': enIsValidField}"  class="en-block__decoration  decoration__1"></span>
                                                </div>
                                                        <!--play icon  -->
                                                <div class="en-block__play-icon">
                                                        <span class="play-icon   material-symbols-outlined"
                                                            :class="{'play-animation': isPlayingNow === true}"
                                                            @click="playThis(inEnglish, 'en')">volume_up
                                                        </span> 
                                                </div>
                                        

                                                
                        </div>
                        
                        <!--english suggestions -->
                        <div class="suggestion-block ">       
                            <div class="suggestion-block__item" 
                                v-for="suggestion in enSuggestions" 
                                @click="clickEnSuggestion(suggestion)">
                                {{ suggestion }}
                            </div>
                        </div>

                        <!--message -->
                        <div class="en-message message">
                            <span class="message__item"> {{enIsValidMessage}}</span>
                        </div>
                       
                        <!--  -->
                        <!--ukrainaian-->
                        <div class="uk-block">
                            <div class="uk-block__input-container input-container">
                                <input ref="ukInput" class="uk-block__input input__1"  :class="{'decorationIsActive': ukIsValid}" @blur="ukInputNotActive" @focus="ukInputISActive" type="text" required id="uk-input" v-model="inUkrainian">
                                <label class="uk-block__label label__1" for="uk-input">inUkrainian</label>
                                <span  :class="{'active': ukIsValidField}"  class="uk-block__decoration decoration__1"></span>
                            </div>
                        </div>
                           <!--message -->
                           <div class="en-message message">
                            <span class="message__item"> {{ukIsValidMessage}}</span>
                        </div>
                       
                        <!--  -->
                        <!--transcription-->
                        <div class="tr-block">
                            <div class="tr-block__input-container input-container">
                            <input ref="trInput" class="tr-block__input input__1" :class="{'decorationIsActive': trIsValid}" @blur="trInputNotActive"  type="text" required id="tr-input" v-model="inTranscription">
                            <label class="tr-block__input label__1" for="tr-input">inTranscription</label>
                            <span :class="{'active': trIsValidField}" class="tr-block__decoration decoration__1"></span>
                            </div>
                        </div>
                           <!--message -->
                           <div class="en-message message">
                            <span class="message__item"> {{trIsValidMessage}}</span>
                        </div>


                    <!--addWords message-->
                <div class="addWords-message message">
                    <span class="message__item"> {{ getWordsMessage }}{{ errorMessage }}</span>
                </div>
            

              <div class="button-1" 
              @click="sendData(inEnglish.toLowerCase(), inUkrainian.toLowerCase(), inTranscription.toLowerCase())"
             
             
              >Зберегти</div>
           
 </div>

                         
    </div>
  
     
      
               
    <!-- <RouterView /> -->
</template>

<script>

import { RouterLink, RouterView } from 'vue-router'
import categoryList from '../components/categoryList.vue'
import { checkWord, checkUkrainianAndTranscriptionWord } from '../store/modules/helpers'
import { socket } from "../socket"
import {playLongAudio, playShortAudio} from '../store/modules/helpers'
import addCategory from './addCategory.vue'


export default {
    name: 'addWords',
    components: {
        categoryList,
        addCategory,
    },

    data() {
        return {
            categoryIsNotSelected: false,


            inEnglish: '',
            inTranscription: '',
            inUkrainian: '',
        // 
            errorMessage: '',
            selectedCategory: null,
            suggestions: [],
        // 
            
            isPlayingNow: false,

       //================================================================     
        // англійський блок
            enSuggestions: [],
            enIsValidMessage: '',
            enIsValidField: false,
        //для добавления класа, для красной или зеленой линии 
            enIsValid: false,
            enIsNotValid: false,
    
         

        //================================================================
        // український блок
            ukIsValidMessage: '',
            ukIsValidField: false,
        //для добавления класа, для красной или зеленой линии 
            ukIsValid: false,
            ukIsNotValid: false,

            
        //================================================================
            trIsValidMessage: '',
            trIsValidField: false, 
  //для добавления класа, для красной или зеленой линии 
            trIsValid: false,
            trIsNotValid: false,





         
         
        
      
        }
    },
   


    methods: {
        clearEnUkTrValidMessages(){
            this.trIsValidMessage = this.ukIsValidMessage = this.ukIsValidMessage = ''
        },
        async getCategory(category) {
            const selectCategory = await this.getCategories.find(el => el.categoryId === category.categoryId)
            await this.$store.commit('makeAddWordsSelectedCategory', selectCategory)
            await this.$store.commit('makeAddWordsCategoryLabel', selectCategory)
        },

        async sendData(inEnglish, inUkrainian, inTranscription) {
                        const enInput = this.$refs.enInput;
                        const ukInput = this.$refs.ukInput;
                        const trInput = this.$refs.trInput;


                        enInput.blur()
                        ukInput.blur()
                        trInput.blur()

            const category = await this.$store.getters['getAddWordsSelectedCategory']

                    if (category && this.enIsValidField && this.inEnglish.length && this.ukIsValidField && this.inUkrainian.length && this.trIsValidField && this.inTranscription.length && this.trIsValidField) {
                       


                                if (category.categoryId) {
                                    const categoryId = await category.categoryId
                                    await this.$store.dispatch('sendWords', { inEnglish, inUkrainian, inTranscription, categoryId, category })
                                   
                                        if (this.getAddWordsResponseStatus === 201) { 
                                                //для того щоб пропала червона і зелена лінія
                                                this.enIsValid = this.ukIsValid = this.trIsValid = false
                                                this.ukIsValidMessage = this.enIsValidMessage = this.trIsValidMessage = ''
                                                //------

                                                    setTimeout(() => (this.inEnglish = this.inUkrainian = this.inTranscription = ''), 200)

                                                    await this.$store.dispatch('getCategories')
                                                    const selectCategory = await this.getCategories.find(el => el.categoryId === category.categoryId)
                                                    await this.getCategory(selectCategory)
                                                
                                                    //додае слово в wordList якщо там відкрито
                                                    if (this.$store.getters['getWordListSelectedCategory']) {
                                                        this.$store.dispatch('getUserWords', this.$store.getters['getWordListSelectedCategory'])
                                                    }
                                              
                                                    enInput.focus()

                                                        }
                                        } else {
                                                        
                                            this.errorMessage = 'Спочатку оберіть категорію'
                               
         


                                        }
                    } else {
                       

                                if(!category){ 

                                    this.categoryIsNotSelected = true
                                    setTimeout(()=>{this.categoryIsNotSelected = false},300)
                                    this.errorMessage = 'Спочатку оберіть категорію'

                                }else if(this.getAddWordsResponseStatus === 201){
                                    this.errorMessage = 'Таке слово уже є'
                                    enInput.focus()
                                }
                                else if(this.inEnglish.length === 0){
                                    this.errorMessage = 'Заповніть поле enEnglish'
                                    enInput.focus()

                                 }else if(this.enIsValidField === false){
                                    enInput.focus()
                                    this.errorMessage = 'Некоректно заповнено поле enInglish'
                            
                                }else if(this.inUkrainian.length === 0){
                                    this.errorMessage = 'Заповніть поле inUkrainian'
                                    ukInput.focus()
                                }else if (this.ukIsValidField === false){
                                    ukInput.focus()
                                    this.errorMessage = 'Некоректно заповнено поле inUkrainian'

                                }else if (this.inTranscription.length === 0){
                                    this.errorMessage = 'Заповніть поле inTranscription'
                                    trInput.focus()
                                }else if (this.trIsValidField === false){
                                    this.errorMessage =  'Заповніть поле inTranscription'
                                    trInput.focus()
                                }
                                                        
                         setTimeout(() => (this.errorMessage = ''), 1000)
                             return
                    }



        },

        clickEnSuggestion(word) {
            this.inEnglish = word
        },

        async playThis(data, language) {
        if(this.inEnglish.length > 0 && this.isPlayingNow === false){
            try {
                this.isPlayingNow = true
                await playLongAudio(data, language);
                this.isPlayingNow = false
            } catch (error) {
                console.error('Ошибка воспроизведения аудио:', error);
            }

        }else{
            return
        }

       



          
        },



//коли забераєш мишку з інпутів
        enInputNotActive() {
            if (this.enIsValidField && this.inEnglish.length) {
                    this.enIsValidMessage = ''
                    this.enIsValid = true//для того щоб залишилась зелена лінія
            } else if (this.inEnglish.length) {
                   this.enIsValid = true//для того щоб залишилась червона лінія
            } else if (this.inEnglish.length === 0) {
                   //для того щоб пропала червона і зелена лінія
                    this.enIsValid = false
                    this.enIsValidMessage = ''
            }
                     setTimeout(()=>{this.enSuggestions = []},500)
        },

        ukInputNotActive() { 
          if(this.ukIsValidField && this.inUkrainian.length){
            this.ukIsValidMessage = ''
            this.ukIsValid = true
          }else if(this.inUkrainian.length){
           this.ukIsValid = true
          }else if(this.inUkrainian.length === 0) {
            this.ukIsValid = false
            this.ukIsValidMessage = ''
          }
           
        },

        trInputNotActive(){
            if(this.trIsValidField && this.inTranscription.length){
                 this.trIsValidMessage = ''
                 this.trIsValid = true
            }else if(this.inTranscription.length){
                this.trIsValid = true
            }else if(this.inTranscription.length === 0) {
                this.trIsValid = false
             
                 this.trIsValidMessage = ''
            }
           
        },
 //=============================      
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

        getAddWordsResponseStatus(){
            return this.$store.getters['getAddWordsResponseStatus']
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
       
     if(this.inEnglish.trim().length>0){
            const isValid = checkWord(newValue).isValid
                this.enIsValidField = isValid
                const isValidMessage = checkWord(newValue).message
            
                if (isValid) {
                    socket.emit('someMessage', newValue)// визиваем функцию someMessage
                    socket.on('enSuggestions', (enSuggestions) => {this.enSuggestions = enSuggestions})
                } else {
                    this.enIsValidMessage = isValidMessage
                }

     }else{
        this.inEnglish = ''
     }
          


            
          
        },
        inUkrainian(newValue) {
if(this.inUkrainian.trim().length>0){
           this.ukIsValidField = checkUkrainianAndTranscriptionWord(newValue).isValid
            if(this.ukIsValidField === false) {
                this.ukIsValidMessage = checkUkrainianAndTranscriptionWord(newValue).message
            }
}else{
    this.inUkrainian = ''
}
        
        },
        inTranscription(newValue) {
if(this.inTranscription.trim().length>0){
           this.trIsValidField = checkUkrainianAndTranscriptionWord(newValue).isValid
            if(this.trIsValidField === false) {
                this.trIsValidMessage = checkUkrainianAndTranscriptionWord(newValue).message
            }
}else{
    this.inTranscription = ''
}
          
           
        }
    }
}


</script>

<style lang="scss" scoped>
.isNotSelected{
    background-color: red;
}

//@import '../../src/styles/playButton.scss';
$check-icon-color: rgb(46, 222, 90);
$cancel-icon-color: rgb(249, 22, 22);

.addWords{
    margin: 10px;

}

.addWords-container{
    border: 1px solid rgb(255, 254, 254);
    border-radius: 10px;
    box-shadow: 0px 0px 10px grey;
    max-width: 320px;
    padding: 5px 10px;
}

.input-container {
   
  
    position: relative;
    padding: 25px 10px 10px 10px ;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
    
}
.label__1{
    position: absolute;
    top: 20px;
    opacity: 0.9;
    transition: all .2s ease;
   color: rgb(63, 62, 61);

}
.input__1 {
    width: 100%;
    display: block;
    border: none;
    border-bottom: 1px solid rgb(218, 209, 209);
    padding-bottom: 5px;
 
   

            &:focus ~ .label__1{
            top: 0px;
            opacity: 0.4;
            transition: all 0.2s ease;
            }

            &:focus{
                outline: none;
            }
            &:valid ~ .label__1{
                top: 0px;
            }
            &:focus~.decoration__1:before{
                width: 50%
            }
            &:focus~.decoration__1:after{
                width: 50%
            }



            &.decorationIsActive ~.decoration__1:before{
                width: 50%
            }
            &.decorationIsActive ~.decoration__1:after{
                width: 50%
            }


}


.decoration__1 {
    position: relative;
    display: block;
    width: 100%;


        &::before{
            content: '';
            position: absolute;
            height: 1px;
            background-color: rgb(255, 28, 3);
            width: 0px;
            left: 50%;
            bottom: 0;
            transition: all .3s ease;
        }
        &::after{
            content: '';
            position: absolute;
            background-color: rgb(246, 35, 12);
            height: 1px;
            right: 50%;
            width: 0px;
            bottom: 0;
            transition: all .3s ease;
        }
                  //если ектив
                    &.active{
                        &::after{
                            background-color: rgb(5, 246, 9);
                            transition: all .3s ease;
                        }
                        &::before{
                            background-color: rgb(45, 246, 5);
                            transition: all .3s ease;
                        }
                    }

}




.en-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
 
}


.suggestion-block {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    gap: 5px;
    color: rgb(158, 155, 155);
    padding: 0px 10px;

        .suggestion-block__item{
            font-size: .8rem;
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


.message {
    text-align: center;
    padding: 10px 0px;
        
    .message__item {
            font-size: 10px;
            font-weight: 200;
        
        }
}


.button-1{
    display: flex;
    align-items: center;
    justify-content: center;
    padding:5px 0px;
    border-radius: 5px;
    box-shadow: 0px 0px 5px rgb(98, 97, 97);
    transition: all .5s ease;
    text-align: center;

        &:hover{
                cursor: pointer;
                background-color: rgb(248, 170, 24);
                box-shadow: 0px 0px 10px rgb(222, 189, 126);
                transition: all .5s ease;
                
             
            }
}

</style>


