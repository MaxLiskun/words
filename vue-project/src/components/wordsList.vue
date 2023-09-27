<template>
    <div>
        <br>
        <hr>
        <hr>

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

        <ul class="user-words" v-for="word in userWords" :key="word._id">
            <li class="user-words_item">
                <div class="words">
                    <span>{{ word.inEnglish }}</span>
                    <span> [{{ word.inTranscription }}]</span>
                    <span> {{ word.inUkrainian }}</span>
                </div>



                <div v-if="deletedWordId === word._id">слово видалене</div>

                <div class="words-nav">
                    <span class="material-symbols-outlined" @click="renameWordsMenu(word._id)">edit_note</span>
                    <span class="material-symbols-outlined" @click="deleteWord(word._id)">delete</span>
                </div>


                <div class="rename-words" v-if="isButtonRenameWordsMenuActive && clickedWord_id === word._id">
                    <input type="text" placeholder="inEnglish" v-model="inEnglish">
                    <input type="text" placeholder="inTranscription" v-model="inTranscription">
                    <input type="text" placeholder="inUkrainian" v-model="inUkrainian">
                    <div class="change-word" @click="changeWord(word._id)">змінити</div>
                    <span class="rename-words-message">{{ renameWordMessage }}</span>

                </div>
            </li>

        </ul>
        {{ categoryMessage }}


    </div>
    <RouterView />
</template> 

<script>
import { RouterLink, RouterView } from 'vue-router'
import categoryList from '../components/categoryList.vue';


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


            isButtonRenameWordsMenuActive: false,
            clickedWord_id: null,
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
                setTimeout(() => { this.renameWordMessage = '' }, 1000)
            } else {
                const newWord = {
                    inEnglish: this.inEnglish,
                    inUkrainian: this.inUkrainian,
                    inTranscription: this.inTranscription,
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
            this.inEnglish = newWord
        },
        inUkrainian(newWord) {
            this.inUkrainian = newWord
        },
        inTranscription(newWord) {
            this.inTranscription = newWord
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

<style scoped>
ul {
    list-style: none;
    text-decoration: none;
    padding: 0;
    margin: 0;
}

li {
    display: flex;

    justify-content: space-between;
    align-items: center;
    box-shadow: 0px 3px 10px rgb(200, 197, 197);
    margin: 5px 2px 5px 2px;
    padding: 1px 2px 1px 2px;
}

.words {
    display: flex;
    gap: 10px;
}

.material-symbols-sharp:hover {
    color: red;
    font-size: 1.5rem;
    cursor: pointer;
}
</style>




