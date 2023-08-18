<template>
  <div>
    <h1>Login</h1>
    Email: <input type="text" v-model="email"> <br><br>
    Password: <input type="password" v-model="password"> <br> <br>
    <button @click="login">УВІЙТИ</button>
    {{ errors }}

  </div>

  <RouterView />
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

          //console.log(res.data)
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