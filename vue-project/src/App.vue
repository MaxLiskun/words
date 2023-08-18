<template>
    <div>

     <strong v-if="getInfo.name"> Привіт {{ getInfo.name }}</strong>
 <br>

    <router-link   class="router-link" to="/signup">реєстрація</router-link>
    <router-link   class="router-link" to="/login"> увійти </router-link>


        <button @click="logout">вийти</button>
        <hr>
    </div>
    <RouterView />
</template>




<script>
import { RouterLink, RouterView } from 'vue-router'
import Signup from './components/Signup.vue'

export default {
    name: "App",
    components: {
        Signup
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
        },
        
        

    },
    mounted() {

    
        if (localStorage.getItem('token') === null) {
            this.$router.push('/login');
            return
        } else {
            this.$store.dispatch('getInfo')

        }

    },
    computed:{
      getInfo(){
        return this.$store.getters.userInfo
      }
 
        

    }




}

</script>
<style>
.router-link {
    text-decoration: none;
    color: rgb(246, 5, 5);
}
</style>

