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






            <div v-if="testIsOverStatus"  class="overlay"></div>

            <div v-if="testIsOverStatus"  class="overlay-content">


                            <v-container v-if="testIsOverStatus"  class="result">
                                hello2
                            <!-- заголовок картки -->
                            <v-row cols="12">
                            <v-col> Тест пройдено
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illum sint fugiat nisi autem minima blanditiis aspernatur odit cum quia commodi aliquid eum sed omnis iusto porro animi, quod dicta nemo?    
                            </v-col>
                            </v-row>
                            
                            
                            
                            <!--Імя тесту-->
                            <v-row>
                            <v-col >{{ getResultOfWordsTest.selectedCategory.name }}</v-col>
                            </v-row>
                            
                            <!-- Правильні не правильні -->
                            <v-row>
                            <v-col>
                                <!-- true -->
                                <v-icon class="p-4"  style="color: rgb(88, 170, 88); font-size: 18px" icon="mdi-thumb-up"></v-icon> 
                                <strong class="pa-2" style="color: green; font-size: 13px">{{ getResultOfWordsTest.trueAnswersCount }}</strong>  
                            </v-col>
                            <v-col>
                                <!-- false -->
                                <v-icon class="" style="color: rgb(255, 0, 0); font-size: 18px" icon="mdi-thumb-down"></v-icon>
                                <strong class="pa-2" style="color: red; font-size: 13px">{{ getResultOfWordsTest.falseAnswersCount }}</strong>  
                            </v-col>
                            </v-row>
                            
                            <!-- DIVIDER -->
                            <v-divider class="mx-4 mb-1"></v-divider>
                            
                            
                            <v-row v-for="el in getResultOfWordsTest.falseAnswersArr">
                            <v-col >
                                {{ el.inEnglish }}
                                <!--  -->
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus aperiam eaque sunt expedita architecto exercitationem inventore accusantium est velit. Veritatis pariatur commodi fuga iure nostrum, libero iste voluptate dolores vero!
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi aperiam odio maxime ducimus est tempora. Magnam distinctio commodi suscipit impedit laudantium. Dolor sequi veritatis quo quibusdam. Quam explicabo debitis sint! Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, molestias eaque, alias nobis sed, sequi exercitationem culpa illum amet voluptatibus quisquam cupiditate? Incidunt soluta, dolore eligendi quas in culpa omnis.
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit, optio quae! Distinctio accusamus deserunt earum obcaecati optio eaque! Quas voluptatibus aut impedit laborum incidunt sapiente saepe aliquam commodi temporibus amet.
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos eum velit a magnam quam, sit doloribus repudiandae natus? Inventore velit ex iusto est eos eveniet! Repudiandae, sunt ut. Soluta amet ad aspernatur dolorem nam laborum molestiae explicabo, animi itaque est eveniet dolorum nostrum cum sunt voluptas. Unde, provident tempora! Aliquid sed tempore facere molestias accusamus fugit unde ullam quia mollitia dicta magni adipisci necessitatibus temporibus obcaecati sit praesentium architecto voluptatibus magnam, et beatae quasi debitis? Quasi aut expedita eum ut earum ipsa porro optio a dolore iusto minus sunt quod provident deleniti amet dolorum nobis praesentium impedit, id consectetur explicabo minima ullam distinctio. Recusandae qui, totam magnam deserunt veritatis ullam consectetur, praesentium quibusdam iste aspernatur tempore quis, quisquam quaerat eum non laboriosam nobis pariatur? Omnis laudantium inventore eos magni doloribus, illum quibusdam ea praesentium ad fugiat incidunt in quidem et adipisci numquam modi excepturi, accusamus nisi, alias aspernatur facilis explicabo maiores sint! Dignissimos ut sunt inventore culpa soluta? Ut omnis debitis aspernatur fugit perferendis praesentium at magnam maiores odio distinctio facilis dolor dolore iste delectus odit, consectetur reprehenderit beatae ipsam explicabo autem! Aliquid quod labore a fugit quo veritatis in deserunt repudiandae accusantium cumque, saepe atque quia libero magni perferendis at? Incidunt error cumque ipsa natus, earum, soluta quis ullam quisquam corrupti maxime nihil cupiditate sunt veniam doloremque. Voluptas quam quos suscipit sunt quidem, iure eius deserunt dolore quod, dolor molestiae. Odio soluta nobis commodi dolores corrupti? Nam, sapiente unde tempora fugit nobis dolorum? Fugiat nostrum, quos pariatur distinctio tempore culpa consequuntur soluta qui. Quis excepturi eius earum nobis quidem harum quisquam numquam soluta, consectetur adipisci nisi nihil quam quia iure ab corporis error in illum recusandae deleniti ea nam. Nam minima dolores quis aperiam est voluptatum quae, odio ipsam cupiditate nemo consectetur eos ad qui id recusandae laudantium, saepe inventore pariatur? Ea sint placeat nemo ab, quia incidunt architecto laborum maxime molestias et ducimus consequatur iste inventore accusantium optio dolorem quae rerum. Nobis at omnis magnam deleniti voluptas nulla, quae quod dolores molestiae quaerat architecto. Accusamus doloribus fugit ipsa illum a quos est numquam quas provident. Porro perferendis neque molestias error harum asperiores eos ut repellendus voluptate ab! Asperiores, voluptatum quae incidunt, dolorem obcaecati nisi voluptate odio magni, ab maxime error ipsum iusto nam fugiat consequuntur laboriosam minus facilis vitae et! Illo, non ab qui excepturi, ducimus nulla architecto adipisci tempora similique vel laborum voluptate delectus a reprehenderit? Accusamus harum laudantium vero excepturi reiciendis aliquam. Iusto maxime accusamus ab quasi rerum, sequi consequatur aperiam veritatis eligendi maiores vel adipisci cumque harum nesciunt? Nobis magni facilis at, deleniti corrupti maiores perspiciatis error, officia architecto quia ducimus aut facere dicta inventore vero sunt tempore veniam itaque. Dignissimos numquam, minus, tenetur, laborum rerum repellendus veniam commodi officiis voluptatum laudantium sequi architecto repudiandae provident totam explicabo eveniet iste! Deleniti, ratione maxime quam amet fuga aliquid ipsa minus deserunt perferendis cupiditate. Impedit accusamus quisquam aut, adipisci nesciunt iure ullam temporibus est officiis? Asperiores quis exercitationem a labore, facere tempore consequuntur quo sed corporis veniam ipsam omnis totam nesciunt distinctio possimus odit nobis eveniet similique. Eaque quasi suscipit accusantium consequuntur provident dolores sunt perferendis odit deserunt sapiente consequatur nulla illum qui pariatur maxime similique error repellat blanditiis distinctio, assumenda, ab quod officiis incidunt? Reiciendis eaque quidem harum expedita cupiditate voluptate inventore magni aspernatur qui commodi magnam, molestias natus optio, cum earum ea? Quas modi id, commodi voluptatum ut enim doloribus quod laboriosam, incidunt quibusdam explicabo quam. Exercitationem beatae alias dolor ducimus velit consequatur molestiae odio similique aliquam deserunt, sed, magnam ullam! Pariatur esse eum, inventore corporis architecto fugit dicta iste ut illo corrupti voluptas quas sint autem est nostrum! Eius aperiam quia vitae quam atque ad illum, tempora magni hic accusantium dolores vel, repudiandae dolore obcaecati? Iusto ullam dolores dolor. Adipisci doloribus, reiciendis laudantium enim obcaecati provident, neque hic et aspernatur perspiciatis, amet sit. Hic quam, dolorum et error voluptates cumque corporis quae ea quas fuga eum ullam consectetur itaque dolorem rem voluptatem rerum eveniet architecto earum repellendus nobis possimus qui sit quod? Fugiat qui, voluptatibus ea eum, neque porro pariatur maiores ipsam tenetur debitis error facere est mollitia ratione ducimus ipsum molestias necessitatibus. Nemo soluta nulla sit odit praesentium ipsum adipisci delectus fugiat, odio deserunt quisquam autem esse reiciendis laboriosam maiores pariatur quod cumque quos iste saepe, sed ea. Consequuntur ea blanditiis nostrum, iusto et corrupti qui sit quo deleniti enim molestias dolor. Aspernatur dolores consequuntur explicabo unde fugit delectus deleniti, dicta esse quam ipsum. Natus perspiciatis porro voluptatum recusandae inventore repellendus ea quis maiores, minima expedita, quam eveniet deserunt minus? Nisi veniam aperiam consequuntur neque quam minus molestiae aliquid, quia autem. Porro, ratione expedita placeat ipsa hic ut necessitatibus facere minima modi itaque ipsum totam cum maiores iste quis repellat quod dolor tempora distinctio odio neque illo temporibus ipsam. Doloremque esse maiores repudiandae ratione aliquam sint explicabo laborum atque consequuntur! Totam eum aperiam, temporibus necessitatibus magni laboriosam! Voluptas quisquam earum molestiae maxime nobis, ducimus optio sunt facilis obcaecati quaerat est ad veritatis doloribus quo fugiat laudantium iure expedita, soluta hic numquam eos consequatur, error repellat dolores. Ut soluta dolorum tenetur nulla deserunt porro consequuntur illo quidem, laboriosam quia tempore fugiat temporibus distinctio non eum modi, labore reprehenderit. Dolore illo, tempora eaque neque quasi corrupti sed repellat? Vel neque tenetur, enim temporibus eius quam facere corporis qui laborum illo rem voluptatem cupiditate provident saepe, sit, expedita ratione dolor. Soluta iusto illo explicabo. Aut, incidunt itaque mollitia enim vel harum nostrum reprehenderit culpa corrupti reiciendis, dolore sit dolores. Porro reiciendis dolores molestiae quidem veritatis nobis magni asperiores aperiam similique fugiat veniam cumque, eius maiores animi dolorem expedita sit labore debitis nulla voluptatem ipsam? Cum, laborum! Voluptatum neque praesentium culpa quae magni tempore optio iure non exercitationem dolore reprehenderit quos eveniet aperiam dolorem id voluptate ex dolor iste nisi, alias a consequuntur voluptatibus perferendis. Veritatis temporibus perferendis molestiae eius ratione, obcaecati atque ducimus dignissimos magnam autem aliquid quos eligendi tenetur architecto cumque dolores dicta alias amet. Tempore, molestias quam! Eaque voluptates cum corporis maiores incidunt voluptatum!
                            
                                <!--  -->
                            
                            </v-col>
                            </v-row>
                            
                            <!-- Кнопки -->
                            v-row
                            </v-container>



            </div>





</div>


<!-- 
                <v-overlay
 v-model="overlay"
 activator:parent
 class="align-center justify-center "
 contained
 location-strategy="connected"
 scroll-strategy="block"
>
</v-overlay> -->















<!--  -->











  
     
  
  

</template>

 <script setup>


import { useStore } from 'vuex'
import { ref, reactive, onMounted, watch, computed, onBeforeUnmount } from 'vue';
import categoryList from '../components/categoryList.vue';
import { playLongAudio } from '../store/modules/helpers';


const store = useStore()


const overlay = ref(true)

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
            //store.commit('clearWordTestResult')// для очистки минулого результату  якщо він є
        }
    }
}


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
        overlay.value = true // для показу результатів після тесту
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

.container{
    position: relative;
    width: 100%;
    height: 100%;
  

}

.overlay{
    position: fixed;
    background-color: rgb(0, 0, 0);
    opacity: 0.5;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 300;
    overflow: hidden;
}

.overlay-content{
    position: absolute;
    overflow: hidden;
    top: 20%;
    left: 0;
    background-color: rgb(255, 255, 255);
    z-index: 301;
    width: 90%;
    //min-height: 20%;
    margin: 0 5% 0 5%;


}
</style>