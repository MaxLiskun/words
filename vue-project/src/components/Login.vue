<template>
 
  
<div class="container">
      
        <v-container style=" max-width: 600px; margin: 0 auto;" class="elevation-10 border rounded-xl ">
      <v-row>
        <!-- col-1 -->
              <v-col>
                        <v-row>
                          <v-col>
                            <h1>Вхід</h1>
                          </v-col>
                        </v-row>

                        <v-divider class="ma-2"></v-divider>
                      
                        <v-row>
                          <v-col>
                            <!-- номер -->
                            <v-text-field   label="Номер телефону"
                             variant="outlined" 
                             class="w-100 mt-2"
                             :rules="rules.userNumber"
                             v-model="userPhone" 
                             @input="handleNumberInput"
                             ></v-text-field>
                            

                            <!-- пароль -->
                           <v-text-field label="Пароль"
                             variant="outlined" 
                             class="w-100 mt-2"
                             type="password"
                             :rules="rules.userPassword"
                             v-model="userPassword"
                             @input="handlePasswordInput"
                             >
                            </v-text-field> 
                          
                          </v-col>
                        </v-row>
                        <v-divider class="ma-2"></v-divider>

                        <!-- errors  -->
<v-row v-if="errors" class="text-center ">
  <v-col>
    <p class="">{{ errors }}</p>
  </v-col>
</v-row>
                   <!-- buttons -->
                        <v-row v-if="!canEnter">
                          <v-col>
                            <v-btn class="w-100  rounded-xl bg-green"
                            @click="submit"
                            >Увійти</v-btn>
                            
                            <p class="text-center ma-2 font-weight-bolt hover"
                            @click="toSignUp"
                            >Зареєструватися</p>
                          
                          </v-col>
                        </v-row>


                     <!-- loadinf -->
                        <v-row align="center">
                          <v-col align="center">
                            
                                  <v-icon v-if="enterIcon"
                                  class="mb-5"
                                  color="success"
                                  icon="mdi-check-circle"
                                  size="112"
                              ></v-icon>

                              <v-progress-circular  v-if="enterLoader"
                              color="primary"
                              indeterminate
                              size="100"
                          ></v-progress-circular>

                          </v-col>
                        </v-row>


              </v-col>
      </v-row>
            
        </v-container>
</div>

</template>             



<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

import { useStore } from 'vuex'
const store = useStore()


const userPassword = ref('');
const userPhone = ref('380');

//router
const router = useRouter();

//consts
const canEnter = ref(false);
const enterLoader = ref(false);
const enterIcon = ref(false)
//

const errors = ref('')
const isValid = ref({
isUserPhoneValid: '',
isUserPasswordValid: '',
});

const rules = ref({

       userNumber: [
          (value) => {
            if (!/^\d+$/.test(value)) {
              isValid.isUserPhoneValid = false;
              return 'Тільки цифри';
            } else {
              isValid.isUserPhoneValid = true;


              if (value.length < 12) {
                isValid.isUserPhoneValid = false;
                return 'Заполнено не полностью';
              } else {
                isValid.isUserPhoneValid = true;
                return true;
              }
            }
        }
      ],

      userPassword: [
          value  =>{ 
      if(/[а-яА-Я]/.test(value)){
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

const errorMessage = (message) => {
  errors.value = message
setTimeout(() => {
      errors.value = ""
    }, 1000);
}


//functions
const submit = async () => {

  if(isValid.isUserPasswordValid === true && isValid.isUserPhoneValid === true){
      const candidate = {
              userPassword: userPassword.value,
              userPhone: userPhone.value,
            }

            try {
                const response = await axios.post('http://localhost:3000/api/auth/login', candidate);
                console.log(response.status);
                if(response.status === 200){
                    
                    //
                    canEnter.value = true
                    enterLoader.value = true
                   
                    setTimeout(() => {
                      enterLoader.value = false
                      enterIcon.value = true
                    }, 2000);




                        setTimeout(() => {
                          canEnter.value = false
                          enterIcon.value = false
                                localStorage.setItem('token', response.data.token)
                                router.push('./')
                                store.dispatch('getInfo')
                        }, 2500);
                        
                    //
                   
                }
              } catch (error) {
                errorMessage(error)
                if (error.response) {
                  // Обработка ошибок с сервера
                  errorMessage(error.response.data.title)
                
                } else if (error.request) {
                  // Обработка ошибок запроса
                  errorMessage(error.request)
                
                } else {
                  // Обработка других ошибок
                  errorMessage(error.message)
                }
              }

  }else{
    errorMessage('Заповніть усі поля')
    return
  }

    }



  




const toSignUp = () => {
    router.push('/signup') 
}

const handleNumberInput = () => {

  if (userPhone.value.length > 12) {
    userPhone.value = userPhone.value.slice(0, 12);
  }
  if (userPhone.value.length < 4) {
    userPhone.value = '380'

}
    }

const handlePasswordInput = () => {
      if (userPassword.value.length > 20) {
        userPassword.value = userPassword.value.slice(0, 20);
  }
    }
</script>


<style scoped lang="scss">


.container{
  width: 100%;
  //height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  }
.hover:hover{
  text-decoration: underline;
  cursor: pointer;
  
}



</style>