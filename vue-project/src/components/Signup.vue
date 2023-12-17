<template>

<!-- <div class="container">
    NAME: <input type="text" v-model="name"/> <br>
    EMAIL: <input type="email" v-model="email"/> <br>
    PASSWORD: <input type="password" v-model="password"/> <br>
    <button  @click="signup">signup</button>
    {{errors}}
</div> -->


<!--xs <600 -->
<!--sm 600<900 -->
<!--md 960<1024 -->
<!--lg 1024<1904 -->
<!--xl >1904 -->


         

<div class="container">
   
    <v-container  class="bg-white " no-gutters>
       
        <router-link  class="nav-links__link-login link" to="/login"> Увійти </router-link>
       <!-- row-1 ------------------->
                <v-row  align="center" justify="center" no-gutters>
                
                        <!-- col-1 = -->
                            <v-col  no-gutters cols="" sm="" md="" lg=""  xl="" align="center">
                                <v-img class="rounded-circle"
                                :width="300"
                                aspect-ratio="1"
                                cover
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_TPQzrFZkEcel7SeRF7RQYtKNvaAAoJl2XM5U2ENNG8kzUwyLgQf-ypKIpZns1rtcex8&usqp=CAU"
                            ></v-img>
                            </v-col>
                         <!-- col-2  = -->
                            <v-col no-gutters cols="" md="" lg="" xl="" align="center">
                                <form @submit.prevent="submit">
                                                        
                                                        <!-- Імя -->
                                                            <v-text-field
                                                            label="Імя"
                                                            :rules="rules.userNameLastName"
                                                            prepend-icon="mdi-account"
                                                            v-model="userName"
                                                        ></v-text-field>
                                                    
                                                        <!-- Призвіще -->
                                                            <v-text-field 
                                                            label="Призвіще"
                                                            :rules="rules.userNameLastName"
                                                            prepend-icon="mdi-account"
                                                            v-model="userLastName"
                                                            ></v-text-field>
                                                        <!-- Емейл -->
                                                        
                                                        <v-text-field label="Email одного з батьків"
                                                            :rules="rules.userEmail"
                                                            prepend-icon="mdi-email"
                                                            v-model="userEmail"
                                                            ></v-text-field>
                                                    
                                                            <!-- Телефон -->
                                                            <v-tooltip text="(067)-xx-xx-xxx">
                                                                        <template v-slot:activator="{ props }">
                                                                                <v-text-field 
                                                                                    v-bind="props"
                                                                                    label="Номер телефону"
                                                                                    prepend-icon="mdi-phone"
                                                                                    v-maska:[options]
                                                                                    v-model="userPhone"
                                                                                    :rules="rules.userNumber"
                                                                                    >
                                                                                    
                                                                                </v-text-field>
                                                                        </template>
                                                            </v-tooltip>
                                                        
                                                            <!-- Пароль -->
                                                            <v-text-field 
                                                                label="Пароль"
                                                                prepend-icon="mdi-lock-outline"
                                                                :rules="rules.userPassword"
                                                                v-model="userPassword"
                                                            ></v-text-field>
                                                        
                                                            <!--Аватарка  -->
                                                            <v-file-input
                                                                accept="image/png, image/jpeg, image/bmp"
                                                                placeholder="Pick an avatar"
                                                                prepend-icon="mdi-camera"
                                                                label="Avatar"
                                                                >
                                                            </v-file-input>

                                    <!-- col-2-row-1(buttons)  -->
                                        <v-row>
                                        
                                            <v-col cols="12" align="center" sm="6" md="7" lg="6" xl="6">
                                                <v-btn  
                                                    class=" w-75"
                                                    type="submit" 
                                                  
                                                    >
                                                    Зареєструватися

                                                </v-btn>
                                            </v-col>
            
                                            <v-col cols=""  align="center">
                                                <v-btn class="w-75" >
                                                    Очистити
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                             </form>
                            </v-col>
                </v-row>
     </v-container>


</div> 
</template>


<!-- <script>
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


</script> -->

<style scoped lang="scss">
.container{
width: 100%;
height: calc(100vh - 110px);
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
}


</style>


<script setup>
import { ref, watch } from 'vue';


import { vMaska } from "maska"
const options = { mask: '(###)-###-##-##' };
const myValue = ref('');


const userName = ref('');
const userLastName = ref('');
const userEmail = ref('');
const userPhone = ref('');
const userPassword = ref('')



const isValid = ref({

isUserNameValid: '',
isUserLastNameValid: '',
isUserEmailValid: '',
isUserPhoneValid: '',
isUserPasswordValid: '',

});

const submit = () => {
console.log(isValid.isUserEmailValid)
};

const rules = ref({

    userNameLastName: [
        value => !!value || 'Заповніть поле', 
        value => !/[0-9,.;'[\]\\<>?:"{}|S]/.test(value) || 'Введіть без цифр та спецсимволів',
        value => (value || '').length <= 20 || 'Максимум 20 символів',
        // value  =>{
        //   if (!value){
        //         isValid.isUserNameValid = false
        //         return 'Заповніть поле'
        //   }else if(!/[0-9,.;'[\]\\<>?:"{}|S]/.test(value)){
        //        isValid.isUserNameValid = false
        //         return 'Введіть без цифр та спецсимволів '
        //   }else if(value.length  > 20){
        //     isValid.isUserNameValid = false
        //         return 'Максимум 20 символів'
        //   }else{
        //     isValid.isUserNameValid = true
        //         return true
        //   }
        // } 
    ],

    userEmail: [
        value => {
            const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            if (!value){
                isValid.isUserEmailValid = false
                return 'Заповніть поле'
            }else{
             
             isValid.isUserEmailValid = pattern.test(value)
            return pattern.test(value) || 'Некоректний Email'
            }
        }
    ],
    userNumber: [
        value => {
            if (!value){
                isValid.isUserPhoneValid = false
                return 'Заповніть поле'
            }else if(value.length < 10){
                isValid.isUserPhoneValid = false
                return 'Заповнено не повністю'
            }else{
                isValid.isUserPhoneValid = true
                return true
            }
        }
    ],
    userPassword: [
        value  =>{
          if (!value){
                isValid.isUserPasswordValid = false
                return 'Заповніть поле'
          }else if(/[а-яА-Я]/.test(value)){
                isValid.isUserPasswordValid = false
                return 'Заповніть латинницею '
          }else if(value.length < 8){
                isValid.isUserPasswordValid = false
                return 'Мінімум 8 символів'
          }else{
                isValid.isUserPasswordValid = true
                return true
          }
        } 
    ]
   
},

)



</script>

