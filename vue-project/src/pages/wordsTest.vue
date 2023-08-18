<template>
    <div>
        <router-link class="router-link" to="/">Home</router-link> <br>
        <h3>wordsTest</h3>


        <div class="" v-if="categoryLabel === ''">Давай оберем категорію</div>

        <categoryList v-model="selectedCategory" @category-change="getCategory">
            <template v-slot:categoryLabel>
                <span v-if="categoryLabel">{{ categoryLabel }}({{ categoryLabelWordCount }})</span>
                <span v-if="getCategories.length === 0">Немає категорій</span>
                <span v-if="categoryLabel === '' &&  getCategories.length"> Обери категорію({{getCategories.length}})</span>
            </template>
        </categoryList>

        <div class="start-test-button" @click="startStopTest" v-if="categoryLabel">
            <span v-if="!startStopTestButton">Почати тест</span>
           <span v-if="startStopTestButton">Закінчити тест</span><br><br>
           <span>{{ wordsTestMessage }}</span>


        </div>

        <div class="test" v-if="startStopTestButton && getCategories.length ">

            <div class="test__question" v-if="getWordsTestUserArrWords.question">
                <strong>  {{ getWordsTestUserArrWords.question.inUkrainian}}</strong>
              </div>
           
            <ul class="test__answers" v-for="answer in getWordsTestUserArrWords.answers" :key="answer._id">
                <li class="test__answer"
                @click="getAnswer(answer)"
                >{{answer.inEnglish}}</li>
            </ul>
 
            <span v-if="testInProgress" @click="nextQuestion">наступне питання</span>
        </div>


    </div>
</template>
<script setup>
import { useStore } from 'vuex'
const store = useStore()
import { ref, reactive, onMounted, watch, computed } from 'vue';
import categoryList from '../components/categoryList.vue';

////////////////////////////////////////////////////////////



const selectedCategory = ref(null)


const categoryLabel = ref('')
const categoryLabelLength = ref(null)
const categoryLabelWordCount = ref(null)
const categoryLabel_id = ref(null)
const wordsTestMessage = ref ('')


const startStopTestButton = ref(false)



const testInProgress = computed(() => store.getters.getWordTestTestInProgress)
const getCategories = computed(() => store.getters.stateCategories)
const getWordsTestUserArrWords = computed(() => store.getters.getWordsTestUserArrWords)

const nextQuestion = () =>{
    store.commit("makeWordsTestUserArrWords")
}


const message = new SpeechSynthesisUtterance('father');
  window.speechSynthesis.speak(message);

const getCategory = (category) => {
    
    categoryLabel.value = category.name
    categoryLabelWordCount.value = category.wordCount
    categoryLabelLength.value = category.length
   // userCategory.value = category
    categoryLabel_id.value = category._id 

    store.commit('makeWordsTestSelectedCategory', category)
   
}


const getAnswer = (answer) => {
store.commit('checkWordsTestAnswer', answer)
}

const startStopTest = () => {
    startStopTestButton.value = !startStopTestButton.value
    if (!startStopTestButton.value) {
        selectedCategory.value = null
        categoryLabel.value = ''

    
        store.commit('clearWordsTestFalseTrueAnswersArr')
    } else {
        if(categoryLabelWordCount.value < 6){
            startStopTestButton.value = false
            wordsTestMessage.value = 'Упс((( Замало слів. В категорії повинно бути мінімум 6 слів.'
            setTimeout(()=>{ wordsTestMessage.value = ''},1000)
           
          
        }else{
            store.dispatch('wordsTestGetWords')
           
        }
       
    }

}
watch(testInProgress, (newValue) => {
    if (newValue) {
        store.commit('checkDateTimeOfTest', true)
    } else {
        startStopTestButton.value = false
        store.commit('checkDateTimeOfTest', false)
        store.commit('makeWordsTestResult')
    }
})


watch(getCategories, (newValue) => {
    //якщо ми відкрили тест та хочемо в процесі його змінити
    newValue.forEach(element => {
        if (element._id === categoryLabel_id.value) {
            categoryLabel.value = element.name
        }
    })
    //якщо тест відкритий і ми видаляємо відкриту категорію то все закриеться та очиститься
    if (categoryLabel_id.value) {
        const findElement = newValue.find(element => element._id === categoryLabel_id.value)
        if (!findElement) {
            categoryLabel.value = ''
            categoryLabelLength.value = null
            categoryLabelWordCount.value = null
            categoryLabel_id.value = null
            startStopTestButton.value = false
        }
    }
})







</script>