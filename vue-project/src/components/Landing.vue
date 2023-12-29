<template>
 
    
  <div class="container">
    <h3 >Results</h3>


<ul v-for="result of resultsOfWordTest">
  <li>

    <span> {{  result.selectedCategory.name}}</span><br>
    <span>  {{result.timeOfWordsTest }}   / </span>
    <span>{{result.dateOfWordsTest }}</span> <br>
    <span>Ти робив цей тест за {{result.leftTimeOfWordsTest}} год</span>
    <span> У тесті усього {{ result.selectedCategory.wordCount }} слів , вірних <strong>{{ result.trueAnswersCount }}</strong>  невірних <strong>{{ result.falseAnswersCount }}</strong> </span>
   <hr>
  
  
  </li>
</ul>


<v-icon>mdi-user-secret</v-icon>
    
<!--         
          <v-date-picker
           
          ></v-date-picker> -->
    
         
        
              <!-- <v-rating
                hover
                :length="5"
                :size="32"
                :model-value="3"
                active-color="primary"
              /> -->
        
              <!-- <v-slider></v-slider>
              <v-textarea clearable label="Label" variant="solo-filled"></v-textarea>
              <v-carousel>
                <v-carousel-item
                  src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                  cover
                ></v-carousel-item>
              
                <v-carousel-item
                  src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"
                  cover
                ></v-carousel-item>
              
                <v-carousel-item
                  src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                  cover
                ></v-carousel-item>
              </v-carousel> -->
        
  </div>
  
</template>
<script setup>

import { useStore } from 'vuex'
const store = useStore()



import { ref, reactive, onMounted, watch, computed,} from 'vue';
import { onBeforeMount } from 'vue';





onMounted(() => store.dispatch('getWordTestResults'))
const resultsOfWordTest = computed(() => store.getters.resultsOfWordTest)







</script>

<style scoped>


</style>