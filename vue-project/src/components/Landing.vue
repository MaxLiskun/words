
<template>



          <div class="ma-4 " v-if=" resultsEntries.length > 0 " >
        
                    <pagination 
                      :data="resultsEntries"
                      >
                          <template #card-content="{ item }"  >
                            
                                  <div class="container mb-10 elevation-10 rounded pa-2" >
                                
                                  <v-container fluid  no-gutters class="pa-1 mb-8 align-center justify-center w-100 h-100">
                                  
                                        <v-row no-gutters >
                                          <v-col class="pa-4"  no-gutters>{{ item[0] }}</v-col>
                                        </v-row>
                                      
                                              <v-divider class="w-25"></v-divider>
                                        


                                        <v-row  no-gutters class="mt-4 mb-4 bg-green"  >
                                                              
                                                              
                                              <v-col  cols="3" class="" xs="" sm=""  md=""   lg=""  xl=""  align="left"> <strong>Назва</strong></v-col>
                                              <v-col  cols="3" class="" xs="" sm=""  md=""  lg=""   xl=""  align="left"> <strong>Час</strong></v-col>
                                              <v-col  cols="2" class="" xs="" sm=""  md=""  lg=""   xl=""  align="left"> <strong>Вірно/Невірно</strong></v-col>
                                              <v-col  cols="4" class="" xs="" sm=""  md=""  lg=""   xl=""  align="left"> <strong>Швидкість</strong></v-col>
                                              <v-col  cols="0" class="" xs="" sm=""  md=""  lg=""   xl="" ></v-col>
                                              <v-col  cols="0" class="" xs="" sm="0" md="0" lg=""   xl="" ></v-col>
                                          
                                        
                                        </v-row>
                                                                      
                                  

                                  
                              
                                        <v-row no-gutters  v-for="el in item[1]" class="pa-0 pb-4">
                                        
                                          <v-col  cols="3" xs="" sm=""   md="" lg=""  xl="" align="left"  >{{ el.selectedCategory.name }} ({{el.selectedCategory.wordCount}})</v-col>
                                          <v-col  cols="3" xs="" sm=""   md="" lg=""  xl="" align="left">{{el.timeOfWordsTest }}</v-col>
                                          <v-col  cols="2" xs="" sm=""   md="" lg=""  xl="" align="left" ><span style="color:rgb(47, 255, 109)" >{{el.trueAnswersCount}}</span> / <span style="color: rgb(243, 20, 20)">{{el.falseAnswersCount}}</span></v-col>
                                          <v-col  cols="4" xs="" sm=""   md="" lg=""  xl="" align="left">{{ el.leftTimeOfWordsTest }}</v-col>
                                          <v-col  cols="" xs="" sm="" md="" lg=""  xl="" align="left" ><v-rating
                                            half-increments
                                            readonly
                                            :length="5"
                                            :size="23"
                                            :model-value="el.rating "
                                            color="grey"
                                            active-color="orange"
                                          /></v-col>
                                        
                                        
                                          <v-col cols="" sm="12" md="12" lg=""  xl="" align="left" style="font-size: 0.7rem; color:rgb(253, 91, 91);">{{ el.falseAnswersArr.map(answer => answer.inEnglish).join(', ')}}</v-col>
                                      
                                          <v-divider></v-divider>
                                  

                                    </v-row>

                                  </v-container>
                                
                                
                                </div>
                              
                              
                            
                          </template>

                      
                    
                    </pagination>
          </div>

          <div class="" v-else-if="showNoResultsMessage">Немає реультатів</div>


          <div class="text-center" v-else>
            <v-progress-linear color="primary" indeterminate></v-progress-linear>
          </div>

    
  </template>


<script setup>


const store = useStore()
import { useStore } from 'vuex'
import { ref, reactive, onMounted, watch, computed, watchEffect, onBeforeUnmount} from 'vue';
import pagination from './pagination.vue'





const resultsOfWordTest  = computed(()=> store.getters.resultsOfWordTest)
const resultsEntries = ref('')
const showNoResultsMessage = ref(false);



  watchEffect(()=>{
    if(Object.keys(resultsOfWordTest.value).length>0){
                resultsEntries.value = Object.entries(resultsOfWordTest.value)//перетворюємо обєкт в масив
                resultsEntries.value[0][1].reverse()//Розвертаем результати щоб спочатку були останні
      
      }

})


onMounted(() => {
  //якщо після завантаження небуде результатів
  setTimeout(() => {
    showNoResultsMessage.value = resultsEntries.value.length === 0;
  }, 1000);
});







</script>

<style scoped>

.container{
  background-color: rgb(44, 42, 42);
  color: white;
  font-family: 'Mulish', sans-serif;
  font-weight: 100;
}


@media (max-width:400px){
  .container {
  font-size: 0.7rem;
  }
}



</style>