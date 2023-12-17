<template>
   
        <div class="container">

                      <div class="user-info" v-if="getInfo.name">
                        <div class="user-info__name">{{ getInfo.name}}</div>
                        <font-awesome-icon class="user-info__icon" icon="fa-solid fa-user" size="xl"/>
               
                     </div>

          
                    <!-- <div class="nav__links"  v-if="getIsAuthorized === false">
                        <router-link  class="nav-links__link-signup link" to="/signup">Реєстрація</router-link>
                        <router-link  class="nav-links__link-login link" to="/login"> Увійти </router-link>
                    </div> -->
                

                    <div class="logout"  v-if="getIsAuthorized === true"  @click="logout" >
                        <div class="logout__text">Вихід</div>
                        <font-awesome-icon class="logout__icon" icon="fa-solid fa-arrow-right-from-bracket" size="xl" />
                    </div>
              
             
          
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
        width: 100%;
        height: 100%;
   
        display: flex;
        justify-content: flex-end;
        
    }
    .nav__links{
        width: 100%;
        height: 100%;
        display: flex;
       flex-direction: column;
       
      
            .link{
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: flex-end;
              
                text-decoration: none;
                color: white;
            }
    }
    
    .logout{
        display: flex;
        justify-content: flex-end;
        width: 100%;
        height: 100%;
       
    }
       
    
}



</style>