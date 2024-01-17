<template>
   
        <div class="container">

                      <div class="user-info" v-if="getInfo.name">
                        <div class="user-info__name">{{ getInfo.name }} {{ getInfo.lastName }} 
                             <font-awesome-icon class="user-info__icon" icon="fa-solid fa-user" size="xl"/>


                        </div>
                       
               
                     </div>
                 
              
              
             
                         <v-icon class="logOut"  v-if="getIsAuthorized === true"  @click="logout" icon="mdi-login"></v-icon>
                   
              
             
          
        </div>
       
        
    
  
</template>

<script>

import { RouterLink, RouterView } from 'vue-router'
import Signup from '../components/Signup.vue'




export default {
    name: "headerComponent",
    components: {
        Signup,
     
    },



    data() {
        return {
     
        }
    },
    methods: {
        logout() {
            localStorage.clear();
            this.$store.commit('clearUser');
         
            this.$router.push('/login');

            this.$store.dispatch('getInfo');
            
        },
        
        

    },
    mounted() {
        


    },
    computed:{
      getInfo(){
        return this.$store.getters.userInfo
      },
      getIsAuthorized(){
        return this.$store.getters.getIsAuthorized
      }
 
        

    },
   




}
</script>

<style scoped lang="scss">

.container{
    width: 70%;
    height: 100%;
   
    display: flex;
   flex-direction: column;
    
    .user-info{
     display: flex;
        
    }
 
    
    .logout{
      
       
    }
       
    
}



</style>