<template>
  
   
     
<div class="container w-100">
            <!-- <div class="" v-if="categoryLabel === ''">Давай оберем категорію</div> -->

           

<v-container>
    <v-row>
        <v-col>
            <categoryList v-model="selectedCategory" @category-change="getCategory">
                <template v-slot:categoryLabel>
                    <span v-if="categoryLabel">{{ categoryLabel }}({{ categoryLabelWordCount }})</span>
                    <span v-if="getCategories.length === 0">Немає категорій</span>
                    <span v-if="categoryLabel === '' &&  getCategories.length"> Обери категорію({{getCategories.length}})</span>
                </template>
            </categoryList>

       

        </v-col>

        <v-col>
            <v-btn @click="startStopTest" v-if="!startStopTestButton && categoryLabel">Почати тест</v-btn>
            <v-btn @click="startStopTest" v-if="startStopTestButton && categoryLabel">Закінчити тест</v-btn>
        </v-col>
        {{ wordsTestMessage }}
    </v-row>
    <v-divider></v-divider>
</v-container>





        <v-container v-if="startStopTestButton && getCategories.length " class=" ">
         
            <!-- Question -->
                 <v-row v-if="getWordsTestUserArrWords.question">
                    <v-col>
                <p>{{ getWordsTestUserArrWords.question.inUkrainian}}</p>
                    </v-col>
                </v-row>



<!-- answers -->
<v-row>
                <!-- ряд для відповідей -->
            <v-col cols="12" md="6">
                <v-row  v-for="answer in getWordsTestUserArrWords.answers" :key="answer._id">
                    <v-col>
                        <p class="rounded-lg pa-4 border elevation-0 hover-answer"  @click="getAnswer(answer)">{{answer.inEnglish}}</p>
                    </v-col>

                
                </v-row>
            </v-col>
         
            <!-- ряд для кнопки -->
            <v-col>
                <v-row>
                    <v-col >
                        <v-btn v-if="testInProgress" @click="nextQuestion">наступне питання</v-btn>
                    </v-col>
                </v-row>

            </v-col>
</v-row>
        </v-container>



<!-- результат -->
{{ getResultOfWordsTest }}

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
const getResultOfWordsTest = computed(() => store.getters.getResultOfWordsTest)

const nextQuestion = () =>{
    store.commit("makeWordsTestUserArrWords")
}


// const message = new SpeechSynthesisUtterance('father');
//   window.speechSynthesis.speak(message);

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
    //міняємо кнопку на закінчити тест
    startStopTestButton.value = !startStopTestButton.value
    //якщо ми закінчуємо тест то очищуємо вибранц категорію і очищаємо масив правильних і неправильних результатів
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

    //коли testInProgress (тест в процесі) 
    if (newValue) {
    
        store.commit('checkDateTimeOfTest', true)
    } else {
        // коли false (тест закінчено)
       
        startStopTestButton.value = false
         store.commit('checkDateTimeOfTest', false)
         store.commit('makeWordsTestResult')
         store.dispatch('sendResultToServer')
      
      
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


<style scoped lang="scss">

.hover-answer:hover{
    background-color: rgb(116, 194, 53);
    cursor: pointer;
    transition: all 1s ease;
}

.container{
   
}
</style>