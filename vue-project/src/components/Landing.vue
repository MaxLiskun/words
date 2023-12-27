<template>
 
    
  <div class="container">
    <h3 >landing</h3>


    
    

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
<script>

import { RouterLink, RouterView } from 'vue-router'
import axios from 'axios'
import addWords from './addWords.vue'

export default{
    name: "Landing",
    components:{
        addWords
    },
    data() {
            return {
            overlay: true,
            rating: 4,
            }
        },

      


    methods :   { 

    },
    created(){
    
    },
    mounted(){
      
    
    },
   
  
}

</script>

<style scoped>


</style>