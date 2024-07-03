<template>

<div class="container">

                <!-- прогрес -->

                <v-container fluid  no-gutters class="ma-0 pa-0"  v-if="startStopTestButton && getCategories.length ">
                    <v-row no-gutters class="ma-0 pa-0">
                        <v-col>
                            <v-progress-linear v-model="wordsProgressInPercent" height="2" color="blue"> </v-progress-linear>  
                        </v-col>
                    </v-row>

                    <v-row no-gutters class="ma-0 pa-0">
                        <v-col>
                            <span style="font-size: 10px; color: blue;" >{{ Math.ceil(wordsProgressInPercent) }}/100%</span>
                        </v-col>
                    </v-row>
                </v-container>
            
                    

        
            <!-- ------------------------------------------------------------------------------------------------------------------------------- -->
            <!-- правильні не павельні кількість  -->
            <v-container fluid  no-gutters class="mb-2 pa-0"  v-if="startStopTestButton && getCategories.length">

            <v-row no-gutters align="center" justify="center">
                    <!-- true -->
                        <v-col no-gutters cols="" align="center" justify="center">
                            <v-icon class="p-4"  style="color: rgb(88, 170, 88); font-size: 18px" icon="mdi-thumb-up"></v-icon> 
                            <strong class="pa-2" style="color: green; font-size: 13px">{{getTrueAnswersArr.length}}</strong>  
                        </v-col>

                        <!-- <v-col no-gutters cols="11" align="center" justify="center" >
                        <v-progress-linear height="2" :model-value="getTrueAnswersArr.length/wordsLengthInCategory*100" color="green"> </v-progress-linear>
                        </v-col> -->


                        <!-- false -->
                        <v-col no-gutters cols="" class="" align="center" justify="center" >
                            <v-icon class="" style="color: rgb(255, 0, 0); font-size: 18px" icon="mdi-thumb-down"></v-icon>
                            <strong class="pa-2" style="color: red; font-size: 13px">{{getFalseAnswersArr.length }}</strong>  
                        </v-col>
                        <!-- <v-col  no-gutters cols="11" align="center" justify="center" > 
                                <v-progress-linear height="2" :model-value="getFalseAnswersArr.length/wordsLengthInCategory*100" color="red"></v-progress-linear>
                        </v-col> -->

            </v-row>
            </v-container>



            <!-- ------------------------------------------------------------------------------------------------------------------------------- -->
            <!-- вибір категорії -->

            <v-container fluid  no-gutters class="ma-0 pa-0">
                <p  v-if="!startStopTestButton" >Категорія тесту:{{ categoryLabel}}</p>
                <v-row>
                    <v-col  cols="12"   sm="" xs=""  md=""   lg=""  xl="" >
                    
                        <categoryList   v-model="selectedCategory" @category-change="getCategory" v-if="testInProgress === false">
                            <template v-slot:categoryLabel>
                                <span v-if="categoryLabel">{{ categoryLabel }}({{ categoryLabelWordCount }})</span>
                                <span v-if="getCategories.length === 0">Немає категорій</span>
                                <span v-if="!categoryLabel  &&  getCategories.length"> Обери категорію ({{getCategories.length}})</span>
                            </template>
                        </categoryList>

                    </v-col>
                </v-row>
            </v-container>


            <!-- Вибір типу тесту uk-en en-uk -->
            <v-container fluid v-if="testInProgress === false" >
                <p>Варіант тесту:  {{ testLangVariant }}</p>
                    <v-radio-group v-model="testLangVariant">
                        <v-radio label="Англійська-Українська" value="en-uk"></v-radio>
                        <v-radio label="Українська-Англійська" value="uk-en"></v-radio>
                    </v-radio-group>
            </v-container>






                <!-- питання відповіді кнопки -->
                <v-container>
                    <v-row>
                        <!-- Відповіді і питання -->
                        <v-col  cols="" sm="" xs=""  md="8"   lg=""  xl="" >    
                                            <v-container fluid  no-gutters class="ma-0 pa-0" v-if="startStopTestButton && getCategories.length ">

                                                <!-- Question -->
                                                    <v-row v-if="getWordsTestUserArrWords.question" class="pb-2">
                                                    
                                                        <!-- Text/transcriptions -->
                                                        <v-col align="center" justify="center">
                                                            <div style="letter-spacing: 2px; font-size: 20px" class="font-weight-medium text-uppercase text-center">
                                                                
                                                                <!-- Якщо чекбоксом вибрано якись варіант -->
                                                                    <span v-if=" testLangVariant === 'uk-en' "> {{ getWordsTestUserArrWords.question.inUkrainian}} </span>
                                                                    <span v-else-if="testLangVariant === 'en-uk' ">{{ getWordsTestUserArrWords.question.inEnglish}}  </span>
                                                                <!-- Транскрипція -->
                                                                    <span style="font-size: 14px;" class="text-medium-emphasis" v-if="isHelping &&  testLangVariant === 'en-uk' ">{{[getWordsTestUserArrWords.question.inTranscription]}}</span>   
                                                            
                                                            
                                                            
                                                            </div>
                                                        </v-col>

                                                        <!-- Play question -->
                                                        <v-col v-if="testLangVariant === 'en-uk'" cols="1" sm="" xs=""  md=""   lg=""  xl="" class="ma-0 pa-0">
                                                            <font-awesome-icon icon="fa-high fa-volume-high" style="font-size: 14px;" v-if="isPlayingNow === false && isHelping === true " @click="playDataQuestion(getWordsTestUserArrWords.question.inEnglish)"   ></font-awesome-icon>
                                                            <font-awesome-icon icon="fa-solid fa-square"     style="font-size: 14px;" v-if="isPlayingNow === true"/>
                                                        </v-col>

                                                    </v-row>

                                                    <!-- answers -->
                                                        <v-row no-gutters class="ma-0 pa-0">
                                                                    <v-col cols="12" class=""  sm="" xs=""  md=""   lg=""  xl="" >
                                                                            <v-row  no-gutters class="ma-0 pa-0" v-for="(answer, index) in getWordsTestUserArrWords.answers" :key="answer._id">
                                                                                        <v-col class="mb-6">
                                                                                        
                                                                                            <div class="answer pa-2 border"   >  <!--  @click="getAnswer(answer)" -->

                                                                                                <v-container fluid class="pa-0 ma-0">
                                                                                                        <v-row align="center" justify="center">
                                                                                                                        <!-- чекбокс -->
                                                                                                                        <v-col class=" ma-0 pa-0" cols="2" sm="1" xs=""  md=""   lg=""  xl="">
                                                                                                                            <v-checkbox 
                                                                                                                            v-model="checkboxUserAnswer"
                                                                                                                            color="green"
                                                                                                                            :value="answer"
                                                                                                                            hide-details
                                                                                                                        ></v-checkbox>      
                                                                                                                        </v-col>
                                                                                                                        
                                                                                                                    

                                                                                                                        <!-- answers -->
                                                                                                                        <v-col  class="" cols="8" sm="10" xs=""  md=""   lg=""  xl="">  
                                                                                                                            <div style="letter-spacing: 1px;"  class="font-weight-medium"> 
                                                                                                                                
                                                                                                                                    <!-- Якщо чекбоксом вибрано якись варіант -->
                                                                                                                                            <span v-if=" testLangVariant === 'uk-en' "> {{ answer.inEnglish}} </span>
                                                                                                                                            <span v-else-if="testLangVariant === 'en-uk' ">{{ answer.inUkrainian}}  </span>
                                                                                                                            
                                                                                                                            </div>
                                                                                                                        
                                                                                                                            <div style="font-size: 14px;" class="text-medium-emphasis" v-if="isHelping &&  testLangVariant === 'uk-en' ">{{[answer.inTranscription]}}</div>   
                                                                                                                        </v-col>

                                                                                                                        <!--play-->
                                                                                                                        <v-col v-if="testLangVariant === 'uk-en'" cols="1" sm="" xs=""  md=""   lg=""  xl="" class="ma-0 pa-0">
                                                                                                                            <font-awesome-icon icon="fa-high fa-volume-high" style="font-size: 14px;" @click="playData(answer, index)" v-if="indexOfPlaying !==index"  ></font-awesome-icon>
                                                                                                                            <font-awesome-icon icon="fa-solid fa-square"     style="font-size: 14px;" v-if="indexOfPlaying === index"/>
                                                                                                                        </v-col>
                                                                                                        </v-row>
                                                                                                </v-container>
                                                                                    

                                                                                            
                                                                                            </div>

                                                                                    </v-col>
                                                                            </v-row>
                                                                    </v-col> 
                                                        </v-row>
                                            </v-container>
                        </v-col>

                <!-- Кнопки -->
                        <v-col align="center" justify="center" cols="" sm="" xs=""  md="4"   lg=""  xl="">
                            

                                <v-container fluid  no-gutters class="ma-0 pa-0">
                                    <v-row no-gutters class="ma-0 pa-0">
                                        <v-col   cols="12" align="center" class="">
                                            <v-btn class="bg-green w-100 mb-2  " v-if="testInProgress && startStopTestButton && getCategories.length" @click="getAnswer(checkboxUserAnswer)">
                                                    
                                                    <span>OK</span>
                                            </v-btn>        
                                        
                                        
                                        
                                            <v-btn class="bg-blue-lighten-2 w-100 mb-2 " v-if="testInProgress && startStopTestButton && getCategories.length" @click="nextQuestion">наступне питання</v-btn>             
                                        
                                            <v-btn class="bg-green w-100" @click="startStopTest" v-if="!testInProgress && categoryLabel && testLangVariant !== null">Почати</v-btn>

                                            <v-btn class="bg-orange w-100 mb-2" @click="helpTranscription" v-if="testInProgress === true">Допомога</v-btn>

                                            <v-btn class="bg-red w-100" @click="startStopTest" v-if="testInProgress === true">Завершити</v-btn>
                                        </v-col>
                                        {{ wordsTestMessage }}
                                    </v-row>
                                    
                                </v-container>

                        </v-col>


                    </v-row>
                </v-container>










</div>



<div class="result-container"  @click="handleClickOnResultWindow"  v-if="testIsOverStatus && showResultWindow">
         
        <v-container  v-if="testIsOverStatus"  class="result-content">
           
    <!-- exit-button, date-->
    <v-row  no-gutters class="result-title" align="center">

    <!-- Date -->
      
    <v-col> <strong>{{ getResultOfWordsTest.dateOfWordsTest }}</strong> </v-col>

                <v-col  align="end">
                <font-awesome-icon class="close-button" @click="closeResult"  icon="fa-xmark"/>
                </v-col>
    </v-row>

    <v-divider
    :thickness="1"
    class="border-opacity-50 mt-4 mb-4"
    color="black"
  ></v-divider>
    <!-- rating -->
    <v-row>
                <v-col   cols="12" xs="" sm="" md="" lg=""  xl="" align="end" ><v-rating
                    half-increments
                    readonly
                    :length="5"
                    :size="23"
                    :model-value="getResultOfWordsTest.rating "
                    color="grey"
                    active-color="orange"
                /></v-col>

    </v-row>

    <!-- category name -->
    <v-row >
                    <v-col class="">
                     <p>Категорія: 
                       <strong>'{{ getResultOfWordsTest.selectedCategory.name}}'</strong> 
                    </p>   
                    </v-col>
    </v-row>
            


    <!-- word Counter -->

    <v-row>
        <v-col>
            <p >Кількість слів в категорії <strong >{{ getResultOfWordsTest.selectedCategory.wordCount }}</strong> </p> 
        </v-col>
    </v-row>
            
    <!-- true counter -->
    <v-row no-gutters>
                <v-col>
                <p >Правильних відповідей <strong>{{ getResultOfWordsTest.trueAnswersCount }}</strong> </p> 
                </v-col>
               
    </v-row>


      <!-- false counter -->
      <v-row no-gutters>
        <v-col>
            <p >Неправильних відповідей <strong>{{ getResultOfWordsTest.falseAnswersCount }}</strong> </p> 
        </v-col>
     </v-row>


    <!-- Result -->
    <v-row no-gutters>
        <v-col>
            <p >Результат <strong>{{getResultOfWordsTest.ratingInPercent}}%</strong> </p> 
        </v-col>
    </v-row>




    <!-- Left time -->
    <v-row>
            <v-col>Виконано за <strong>{{ getResultOfWordsTest.leftTimeOfWordsTest}}</strong>  </v-col>
    </v-row>

    <v-divider 
    :thickness="1"
  class="border-opacity-50 mt-4 mb-4"
    color="red"
  ></v-divider>

    <!-- false-answers-->
    <v-row v-if="getResultOfWordsTest.falseAnswersArr.length"  align="center" justify="center"  no-gutters class="false-answers-container mt-2">  
       
        <v-col class="false-answers-container-title" cols=12 align="center" justify="center"><strong>Слова, які потрібно повторити</strong></v-col>
            
        <v-col  align="center" justify="center">
            {{ getResultOfWordsTest.falseAnswersArr.map(el=>el.inEnglish)}}
            </v-col>  

    </v-row>

  
     <!-- send result -->
     <v-row>
        <v-col align="right">
         
       
            <v-btn @click="sendUserResultToEmail" class="send-button">

               <span class="pa-2"  v-if="emailStatus===null">Надіслати</span>
               <span class="pa-2"  v-if="emailStatus==='sending'" >Надcилання</span>
               <span class="pa-2"  v-if="emailStatus==='success'" >Надіслано</span>
               <span class="pa-2"  v-if="emailStatus==='fail'" >Сталася помилка</span>
             

                     <v-progress-circular v-if="emailStatus==='sending'"  indeterminate class="ma-2" :size="20"></v-progress-circular>
      
                     <v-icon v-if="emailStatus==='success'"
                        color="green"
                        icon="mdi-check-circle"
                        size="20"
                    ></v-icon>

                    <v-icon  v-if="emailStatus==='fail'"
                    icon="mdi-cancel"
                    end
                    color="red"
                  ></v-icon>

                  <v-icon v-if="emailStatus===null"
                  icon="mdi-share-variant"
                  end
                  color="black"
                ></v-icon>
                

                </v-btn>
            
              
                  
                        


                
              
        </v-col>
    </v-row>
  

            </v-container>


</div>

</template>

 <script setup>


import { useStore } from 'vuex'
import { ref, reactive, onMounted, watch, computed, onBeforeUnmount } from 'vue';
import categoryList from '../components/categoryList.vue';
import { playLongAudio } from '../store/modules/helpers';


const store = useStore()




//Для вибота типа теста en-uk uk-en

const testLangVariant = ref(null)

//=================================
const checkboxUserAnswer = ref(null)

//для допомоги
const isHelping = ref(false)

//для програвання
const isPlayingNow = ref(false)//для того щоб знати коли закінчиться програвання
const indexOfPlaying = ref(null)// індекс програваємого обєкта
//================

const selectedCategory = ref(null)


//для підрахунку процентів в діаграмі
const wordsLengthInCategory = ref(0)//усього слів в категорії
const wordsLengthInProgress = ref(0)//скільки слів зроблено
const wordsProgressInPercent = ref(0)//скільки слів зроблено в процентах
//  

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



const getTrueAnswersArr = computed(() => store.getters.getTrueAnswersArr)
const getFalseAnswersArr = computed(()=> store.getters.getFalseAnswersArr) 


const testIsOverStatus = computed(() => store.getters.getTestIsOverStatus)

const emailStatus = computed(() => store.getters.getEmailStatus)

const showResultWindow = ref(false)




//================================================================
const playData = ( async(answer, index)=>{
    

    if(isPlayingNow.value === false){
                indexOfPlaying.value = index // присвоюємо змінній миттєво індекс вибраного обєкта щоб значки помінялися
                isPlayingNow.value = true  
                await  playLongAudio(answer.inEnglish, 'en')
                isPlayingNow.value = false
                indexOfPlaying.value = null  // ставимо значення в нуль щоб значки помінялися
    }

         
})
const playDataQuestion = ( async(data)=>{
    console.log(data)
    if(isPlayingNow.value === false){
              
                isPlayingNow.value = true  
                await  playLongAudio(data, 'en')
                isPlayingNow.value = false
             
    }
})
const nextQuestion = () =>{
  
    if(isPlayingNow.value === false){// щоб коли програвання ще не закінчено не переходити на наступне запитання
         checkboxUserAnswer.value = null
         indexOfPlaying.value = null
         isHelping.value = false
         store.commit("makeWordsTestUserArrWords")
    }else{
        return
    }
   
}
const helpTranscription = () =>{
   isHelping.value = true
}
//функція для очистки
const clearData = () =>{
        testLangVariant.value = null   // для очистки впріанту тесту
        selectedCategory.value = null  // для очистки вибраної категорії
        wordsLengthInCategory.value =  wordsLengthInProgress.value = wordsProgressInPercent.value = 0 // для очистки прогресу
        categoryLabel.value = ''        //для очистки вибраної категорії
        checkboxUserAnswer.value = null // для очистки чекбокса відповідей користувача
        isHelping.value = false      
}
const getCategory = (category) => {
    
    categoryLabel.value = category.name
    categoryLabelWordCount.value = category.wordCount
    categoryLabelLength.value = category.length
   // userCategory.value = category
    categoryLabel_id.value = category._id 


     wordsLengthInCategory.value = category.wordCount//усього запитань в категорії

    store.commit('makeWordsTestSelectedCategory', category)
   
}

const getAnswer = (answer) => {  
if(answer){
    wordsLengthInProgress.value += 1//для підрахунку кількості відповідей
    wordsProgressInPercent.value = wordsLengthInProgress.value/wordsLengthInCategory.value * 100////для підрахунку кількості відповідей в процентах

            setTimeout(() => {
                checkboxUserAnswer.value = null
                isHelping.value = false
                store.commit('checkWordsTestAnswer', answer)
            }, 100);


}else{
    return
}

}
//коли натиснули кнопку почати тест
const startStopTest = () => {
   
    //міняємо кнопку на закінчити тест
    startStopTestButton.value = !startStopTestButton.value
 
    //якщо ми закінчуємо тест то очищуємо вибранц категорію і очищаємо масив правильних і неправильних результатів
    if (!startStopTestButton.value) {
            store.commit('checkDateTimeOfTest', false)//кінець відліку часу
            store.commit('clearWordsTestAllArrays') //clearWordsTestFalseTrueAnswersArr також test in progress === false
            clearData()//Ощищаемся
    
    } else {
        //якщо менше 6 слів
        if(categoryLabelWordCount.value < 6){
            startStopTestButton.value = false
            wordsTestMessage.value = 'Упс((( Замало слів. В категорії повинно бути мінімум 6 слів.'
            setTimeout(()=>{ wordsTestMessage.value = ''},1000)
          
        }else{
            //якщо все добре то погнали))))
           
            store.dispatch('wordsTestGetWords') // підтягуєм слова
            store.commit('checkDateTimeOfTest', true)//старт відліку часу
            store.commit('setTestLangVariant', testLangVariant.value)// встановлюємо варіант тесту
            //store.commit('clearWordTestResult')// для очистки минулого результату  якщо він є
        }
    }
}


//для закриття вікна з результатами(натиснути на кнопку)
const closeResult = () => {
  showResultWindow.value = false

}

//для закриття вікна з результатами(натиснути на область за кнопкою)
const handleClickOnResultWindow = (event)=>{
if (event.target.className === 'result-container'){
    console.log('container clicked')
    closeResult()
}
}


//================================================================
//Надіслати результати
const sendUserResultToEmail = ()=>{ //якщо емейл в даний момент невідсилається

        if(emailStatus.value === null){
            store.commit('emailStatus', 'sending') // даємо статус що надсилається
            store.dispatch('sendUserResultToEmail')

        }
}



//================================================================
// коли тест закінчено
watch( testIsOverStatus, (newValue)=>{
    //коли тест повністю закінчено
   if(newValue === true){
         store.commit('checkDateTimeOfTest', false)//кінець відліку часу
         store.commit('makeWordsTestResult') // робим результат
         store.dispatch('sendResultToServer')//відсилаємо на сервер
         store.commit('clearWordsTestAllArrays') // очищаємо всі масиви в сторі і testProgress 
         clearData()//Ощищаемо все на клієнті
        startStopTestButton.value = !startStopTestButton.value  //міняємо кнопку
       
        showResultWindow.value = true// для показу результатів після тесту
   }else{
      return
   }
})

watch(getCategories, (newValue) => {
    //якщо ми відкрили тест та хочемо в процесі його змінити
    newValue.forEach(element => {
        if (element._id === categoryLabel_id.value) {
            categoryLabel.value = element.name
        } 
    })
    categoryLabel.value = ''//для очистки вибраної категорії коли виходиш з тесту

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

//якщо ми виходимо з елементу
onBeforeUnmount(()=>{
         store.commit('clearWordsTestAllArrays') // очищаємо всі масиви в сторі і testProgress 
         clearData()//Ощищаемо все на клієнті
})

onMounted(()=>{
         store.commit('clearWordsTestAllArrays') // очищаємо всі масиви в сторі і testProgress 
         clearData()//Ощищаемо все на клієнті

})

    
</script>


<style scoped lang="scss">
.answer{
cursor: pointer;
}

.result-container{
    background-color: rgba(94, 90, 86, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
}

.result-content{
   background-color: rgb(238, 237, 229);
   box-shadow: 0px 0px 15px rgb(250, 250, 250);
   position: relative;
   top: 10%;
   height: 70%;
   width: 50%;
   overflow-y: auto;
   overflow-x: hidden;
   border-radius: 5px;
  
  
} 

 .close-button{
cursor: pointer;
font-size: 20px;
    &:hover{
    color: rgb(17, 16, 16);
    transition: all .3s ease;
    }
}
.false-answers-container {
    overflow: auto;
    height: 30%;
    //border: .5px solid;
    color: rgb(189, 8, 8);
    border-radius: 5px;
   background-color: rgba(238, 219, 219, 0.966);
}
.send-button{
    background-color: rgb(251, 253, 251);
    color: rgb(0, 0, 0);
   
}


//media
@media (max-width: 1024px){
    .result-content{
        top: 10%;
        height: 80%;
        width: 80%;
        font-size: 0.8rem;
     } 
}

@media (max-width: 720px){
    .result-content{
        top: 10%;
        height: 80%;
        width: 90%;
        
     } 
}





/* Скрыть полосу прокрутки */
//.result-content::-webkit-scrollbar {
 //   display: none;
//} 

</style>