<template>
    <div>
        
        <strong v-if="getInfo.name"> Привіт {{ getInfo.name}}</strong>
        <router-link   class="router-link" to="/signup">реєстрація</router-link>
        <router-link   class="router-link" to="/login"> увійти </router-link>
        <button @click="logout">вийти</button>
    
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
      }
 
        

    },
   




}
</script>
