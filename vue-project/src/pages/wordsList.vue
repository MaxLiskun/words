<template>
    <div>
   

        <router-link class="router-link" to="/">Home</router-link> <br>
        <h3>WordsList</h3>

        <categoryList v-model="selectedCategory" @category-change="getCategory">
            <template v-slot:categoryLabel>

                <span v-if="getCategories.length <= null">Немає категорій</span>

                <div v-if="getWordListSelectedCategory === null && getCategories.length">
                    <span>обери категорію</span>
                    <span> ({{ getCategories.length }})</span>



                </div>

                <div>

                    {{ getWordListCategoryLabel.name }}
                    {{ getWordListCategoryLabel.wordCount }}
                </div>
            </template>



        </categoryList>

        <button @click="makeList">

            <span v-if="!userWords.length"> Сформувати</span>
            <span v-else>Оновити</span>

        </button>
        <button @click="closeList" v-if="userWords.length">Очистити</button>





<!--  -->
<div class="word-container">
    <ul class="word" v-for="word in userWords" :key="word._id">
        <div class="word-main">
                    <div class="word-main__content">
                        <span class="word-main-content _inEnglish">        {{ word.inEnglish }}       </span>
                        <span class="word-main-content _inTranscription"> [{{ word.inTranscription }}]</span>
                        <span class="word-main-content _inUkrainian">      {{ word.inUkrainian }}     </span>
                    </div>



                         <div class="word-main__message" v-if="deletedWordId === word._id">слово видалене</div>
                                                            <!--v-if="deletedWordId === word._id"  -->
                    <div class="word-main__nav">
                        
                        <span class="play-icon   material-symbols-outlined" 
                        :class="{'play-animation': isPlayingNow === true && word._id === currentlyPlayingWordId}" 
                        @click="playThis(word.inEnglish, 'en', word._id)">volume_up
                       </span> 
                        <span class="material-symbols-outlined" @click="renameWordsMenu(word._id)">edit_note</span>
                        <span class="material-symbols-outlined" @click="deleteWord(word._id)">delete</span>
                    </div>
        </div>

        
         <div class="word-rename" v-if="isButtonRenameWordsMenuActive && clickedWord_id === word._id">
                   <div class="rename-container">
                        <label class="word-rename__en-label rename-label" for="rename-en-input         rename-label">inEnglish</label>
                        <input class="word-rename__en-input rename-input"  :class="{'green': enIsValid === true , 'red':enIsValid===false}" id="rename-en-input" type="text" placeholder="inEnglish"       v-model="inEnglish">
                         <span class="word-rename__en-message message-rename">{{inEnglishRenameMessage}}</span>
                    </div>    
                   
                   
                    <div class="rename-container">
                        <label class="word-rename__tr-label rename-label" for="rename-tr-input rename-label">inTranscription</label>
                        <input class="word-rename__tr-input rename-input"   :class="{'green': trIsValid === true , 'red':trIsValid===false}" id="rename-tr-input"  type="text" placeholder="inTranscription" v-model="inTranscription">
                        <span class="word-rename__tr-message message-rename">{{inTranscriptionRenameMessage}}</span>
                    </div>  
                   
                   
                    <div class="rename-container">
                        <label class="word-rename__uk-label rename-label" for="rename-uk-input rename-label">inUkrainian</label>
                        <input class="word-rename__uk-input rename-input"   :class="{'green': ukIsValid ===true , 'red':ukIsValid===false }" id="rename-uk-input"  type="text" placeholder="inUkrainian"     v-model="inUkrainian">
                        <span class="word-rename__uk-message message-rename">{{inUkrainianRenameMessage}}</span>
                    </div>  
                   
                  

                    <div   class="word-rename__change-button" @click="changeWord(word._id)">змінити</div>
                    <div   class="word-rename__message">{{ renameWordMessage }}</div>   
         </div>  
        
    </ul>
</div>


<!--  -->

        {{ categoryMessage }}


    </div>

    <RouterView />
</template> 

<script>
import { RouterLink, RouterView } from 'vue-router'
import categoryList from '../components/categoryList.vue';
import { checkWord, checkUkrainianAndTranscriptionWord } from '../store/modules/helpers';
import {playLongAudio} from '../../src/store/modules/helpers'
export default {
    name: 'wordsLists',

    components: {
        categoryList,
    },
    data() {
        return {
            selectedCategory: null,
            // categoryLabel: '',
            categoryMessage: '',

            inEnglish: '',
            inUkrainian: '',
            inTranscription: '',
            renameWordMessage: '',

        
             inEnglishRenameMessage: '',
             inUkrainianRenameMessage: '',
             inTranscriptionRenameMessage: '',

             enIsValid: null,
             ukIsValid: null,
             trIsValid: null,


            isButtonRenameWordsMenuActive: false,
            clickedWord_id: null,

            isPlayingNow: false,
            currentlyPlayingWordId: null,
        }
    },
    methods: {
        async getCategory(category) {

            const selectCategory = await this.getCategories.find(el => el.categoryId === category.categoryId)
            this.$store.commit('makeWordListSelectedCategory', selectCategory);
            this.$store.commit('makeWordListCategoryLabel', selectCategory)
        },

        closeList() {
            this.$store.commit('clearWordListCategoryLabel')
            this.$store.commit('clearWordListSelectedCategory')
            this.$store.commit('clearUserWords')
        },

        async renameWordsMenu(_id) {
            this.isButtonRenameWordsMenuActive = !this.isButtonRenameWordsMenuActive

            await this.$store.dispatch('getUserWord', _id)

            this.inEnglish = this.getWordTryChange.inEnglish
            this.inUkrainian = this.getWordTryChange.inUkrainian
            this.inTranscription = this.getWordTryChange.inTranscription
            this.clickedWord_id = _id
        },
        async changeWord(_id) {

            
            if (this.inEnglish === '' || this.inUkrainian === '' || this.inTranscription === '') {
                this.renameWordMessage = 'Заповни усі поля'
             return
                setTimeout(() => { this.renameWordMessage = '' }, 1000)
            } else if(this.enIsValid === false || this.trIsValid === false || this.ukIsValid === false) {
              
               return
            }else{
              
                const newWord = {
                     inEnglish: this.inEnglish.toLowerCase(),
                     inUkrainian: this.inUkrainian.toLowerCase(),
                     inTranscription: this.inTranscription.toLowerCase(),
                    _id: _id
                }
                await this.$store.dispatch('changeWord', newWord)
                this.renameWordMessage = this.getWordListMessage
                    setTimeout(() => {
                        this.clickedWord_id = null,
                            this.isButtonRenameWordsMenuActive = !this.isButtonRenameWordsMenuActive
                    }, 1000)
                setTimeout(() => { this.renameWordMessage = '' }, 1000)

            }

        },
        makeList() {

            if (this.getWordListSelectedCategory === null || this.getWordListSelectedCategory === undefined) {
                this.categoryMessage = "Обери категорію"
                setTimeout(() => { this.categoryMessage = '' }, 800)
            } else {
                this.$store.dispatch('getUserWords', this.getWordListSelectedCategory)//

            }

        },
        async deleteWord(id) {
            await this.$store.dispatch('deleteWord', id)
            await this.$store.dispatch('getCategories')
        },

        async playThis(data, language, id) {

        if(this.isPlayingNow === false){
            this.currentlyPlayingWordId = id
            try {
                this.isPlayingNow = true
                await playLongAudio(data, language);
                this.isPlayingNow = false
                this.currentlyPlayingWordId = null
            } catch (error) {
                console.error('Ошибка воспроизведения аудио:', error);
            }
        }else{
          
            console.log('Очікуйте завершення')
            return
        }
         
        },
      

   
    },
    computed: {
        getCategories() {
            return this.$store.getters['stateCategories']
        },

        getWordListMessage() {
            return this.$store.getters['getWordListMessage']
        },
        getWordTryChange() {
            return this.$store.getters['getWordTryChange']
        },
        getWordListCategoryLabel() {
            return this.$store.getters['getWordListCategoryLabel']
        },
        userWords() {
            return this.$store.getters['userWords']
        },
        wordMessage() {
            return this.$store.getters['getWordMessage']
        },
        deletedWordId() {
            return this.$store.getters['deletedWordId']
        },
        getWordListSelectedCategory() {
            return this.$store.getters['getWordListSelectedCategory']
        }

    },
    mounted() {

    },
    watch: {
        inEnglish(newWord) {
          
            this.inEnglishRenameMessage = ''
            if(this.inEnglish.trim().length>0){
                this.inEnglish = newWord
                const checkEn = checkWord(newWord)
               // console.log(checkEn)
                this.enIsValid = checkEn.isValid
                this.inEnglishRenameMessage = checkEn.message 
            }else{
                this.inEnglish = ''
                this.enIsValid = null
              
                
            }
         
        },
       
        inUkrainian(newWord) {
    
            this.inUkrainianRenameMessage = ''
            if(this.inUkrainian.trim().length>0){
                const checkUk = checkUkrainianAndTranscriptionWord(newWord)
                this.inUkrainianRenameMessage = checkUk.message
                console.log(checkUk)
                this.ukIsValid = checkUk.isValid
            }else{
                this.inUkrainian = ''
                this.ukIsValid = null
            }
        },


        inTranscription(newWord) {
            this.inTranscriptionRenameMessage = ''
            if(this.inTranscription.trim().length>0){
                const checkTr = checkUkrainianAndTranscriptionWord(newWord)
                this.inTranscriptionRenameMessage = checkTr.message
                this.trIsValid = checkTr.isValid
            }else{
                this.inTranscription = ''
                this.trIsValid = null
            }
        },




        getCategories: {
            handler(categoryChange) {
                if (this.getWordListSelectedCategory) {
                    const category = categoryChange.filter(element => element.categoryId === this.getWordListSelectedCategory.categoryId)
                    this.$store.commit('makeWordListCategoryLabel', category[0])
                } 
            },
            deep: true
        }

















    }
}
</script>

<style scoped lang="scss">
.word-container {
     width: 100%;
     height: 100%;
   
    //border: 1px solid black;
}
.word {
//border: 1px solid black;
    margin: 5px 0px;
    width: 100%;
    display: flex;
    flex-direction: column;
    //border-bottom: 1px solid black;
}
.word-main {
height: 100%;
width: 100%;
display: flex;
justify-content: space-between;
box-shadow: 0px 0px 3px gray;
border-radius: 3px;
align-items: center;
position: relative;

		// .word-main__content

		&__content {
            flex-wrap: wrap;
            width: 100%;
       
            display: flex; 
            gap: 5px;
            flex: 0 1 100%;
		}

		// .word-main__message

		&__message {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99;
            background-color: rgb(100, 96, 96);
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            opacity: 0.95;
            color: white;
            transition: all 1s ease; 
		}
     
		// .word-main__nav

		&__nav {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 0 1 10%;
           
		}
}

.word-main-content{
  flex: 0 1 20%;
 
}
.material-symbols-outlined {
    cursor: pointer;
    &:hover{
        color: red;
        
    }
}



//================================================
.word-rename {
    border-radius: 2px;
    padding: 5px;
    margin: 5px 0px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    //align-items: center;
    background-color: rgb(234, 233, 228);
    flex-wrap: wrap;
    border-radius: 5px;
   
        & .rename-container{
        width: 100%;
        flex: 0 1 32%;
        margin-bottom: 5px;
        }

		// .word-rename__en-input

	.rename-input {
        width: 100%;
        padding: 5px 10px;
        border: none;
        border-radius: 2px;
        
                &:focus{
                outline: none;
                }
	}

    .rename-label{
        display: inline-block;
        margin: 5px 0px;
        font-size: 16px;
    }
		// .word-rename__change-button
		&__change-button {
                display: flex;
                align-items: center;
                justify-content: center;
                padding:5px 30px;
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
   .message-rename{
    font-size: 12px;
    text-align: center;
    display: block;
    width: 100%;
    padding: 5px 0px 0px 0px;
   }

}

.red{
  //box-shadow: 0px 0px 3px red;
  background-color: rgb(248, 49, 49);
}
.green{
 //box-shadow: 0px 0px 2px rgb(16, 186, 11);
 background-color: rgb(186, 214, 186);
}


//=media
@media (max-width: 500px) {

.word-rename{
flex-direction: column;
gap: 5px;
font-size: 0.8rem;
}

.word-main__content{
font-size: 0.8rem;
}

}



</style>




