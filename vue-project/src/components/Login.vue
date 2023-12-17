<template>
 
<!-- 
border rounded-xl 
w-100 
d-flex flex-wrap flex-column justify-center align-center ga-3
pa-3 pa-md-4 pa-lg-8
text-body-2 text-md-h5 text-lg-h4

bg-sm-red

 -->


<div class="container">
  <h1 style="border">Login</h1>
  Email: <input type="text" v-model="email"> <br><br>
  Password: <input type="password" v-model="password"> <br> <br>
  <button @click="login">УВІЙТИ</button>
  <router-link  class="nav-links__link-signup" to="/signup">Реєстрація</router-link>
  {{ errors }}
</div>
  
   
  

  



 

 

  
  
</template>             

//-------------------------------------------------------
<script>
import { RouterLink, RouterView } from 'vue-router'
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',


      errors: '',
    }
  },

  methods: {
    login() {
      let user = {
        email: this.email,
        password: this.password
      }



      axios.post('http://localhost:3000/api/auth/login', user)
        .then(res => {

          console.log(res.data)
          this.errors = ''
          localStorage.setItem('token', res.data.token)
          this.$router.push('./')
          this.$store.dispatch('getInfo')
        }).catch(err => {
        //  console.log(err.response.data)
          this.errors = err.response.data.title
        })
    }



  }

}


</script>

<style scoped lang="scss">


.container{
  width: 100%;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  }




</style>