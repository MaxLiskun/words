<template>
    <div class="landing-container">
        
       
    
     <!-- <nav class="nav-container">
      <router-link to="/addNewData" class="router-link">addNewData</router-link>   
      <router-link to="/wordsTest" class="router-link">wordsTest</router-link>   
      <router-link to="/wordsList" class="router-link">wordsList</router-link>   
     </nav>
     -->
    <h1>landing</h1>
    </div>

    <RouterView />
  
</template>


<script>

import { RouterLink, RouterView } from 'vue-router'
import axios from 'axios'

export default{
    name: "Landing",
    data() {
            return {
            
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