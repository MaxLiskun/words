<template>
    <div>
        
       <p>Landing</p>
    
     <nav>
     
      <router-link to="/addNewData" class="router-link">addNewData</router-link>   <br>
      <router-link to="/wordsTest" class="router-link">wordsTest</router-link>   <br>
     



     </nav>
    
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
              userName: '',
              userEmail: '',
            }
        },


    methods :   { 
        logout(){
            localStorage.clear();
            this.$router.push('/login');
        },

        


    },
    created(){
      if(localStorage.getItem('token') === null){
        this$router.push('/login');
      }
    },
    mounted(){
      
    
    }
  
}

</script>

<style scoped>



</style>