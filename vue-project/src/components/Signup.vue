<template>

<div class="container">
    NAME: <input type="text" v-model="name"/> <br>
    EMAIL: <input type="email" v-model="email"/> <br>
    PASSWORD: <input type="password" v-model="password"/> <br>
    <button  @click="signup">signup</button>
    {{errors}}
</div>
    

   

   
</template>


<script>
import axios from 'axios'

export default{
    name: 'Signup',
    
//.......................................
        data() {
            return {
              name: '',
              email: '',
              password: '',

              errors: '',
            }
        },
//........................................
        methods: {
            signup(){
                let newUser = {
                    name: this.name,
                    email: this.email,
                    password: this.password 
                }
             //   console.log(newUser)
            axios.post('http://localhost:3000/api/auth/register', newUser)
               .then(res => {
                this.errors = ''
                this.$router.push('/login') // для перехода на логин
              //  console.log(res.data)
               }).catch(err => {
             //   console.log(err.response.data)
                this.errors = err.response.data.title
               })

            }
        }
}


</script>



<style scoped>
.container{

}


</style>

