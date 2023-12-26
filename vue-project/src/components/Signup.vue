<template>



<!--xs <600 -->
<!--sm 600<900 -->
<!--md 960<1024 -->
<!--lg 1024<1904 -->
<!--xl >1904 -->


<div class="container">
   
    <v-container   class="bg-white " no-gutters>
       
        <!-- <router-link  class="nav-links__link-login link" to="/login"> Увійти </router-link> -->
       <!-- row-1 ------------------->
                <v-row  align="center" justify="center" no-gutters>
                
                        <!-- col-1 = -->
                            <v-col  no-gutters cols="" sm="" md="" lg=""  xl="" align="center">
                              
                                <v-progress-circular
                                v-if="loading"
                               
                                :size="100"
                                :width="3"
                                color="grey"
                                indeterminate
                                ></v-progress-circular>

                                <v-img class="rounded-circle"
                              
                                v-if="!loading"
                                :width="300"
                                aspect-ratio="1"
                                cover
                                :src= userImage
                            
                                ></v-img>

                             

                            </v-col>
                         <!-- col-2  = -->
                            <v-col no-gutters cols="" md="" lg="" xl="" align="center">
                                <form @submit.prevent="submit">
     
                                                        <!-- Імя -->
                                                        <v-text-field clearable
                                              
                                                        label="Імя"
                                                        :rules="rules.userName"
                                                        prepend-icon="mdi-account"
                                                        v-model="userName"
                                                      ></v-text-field>
                                                
                                                        <!-- Призвіще -->
                                                            <v-text-field clearable
                                                            label="Призвіще"
                                                            :rules="rules.userLastName"
                                                            prepend-icon="mdi-account"
                                                            v-model="userLastName"
                                                            ></v-text-field>


                                                        <!-- Телефон Користувача -->
                                                        <v-tooltip text="(xxx)-xxx-xx-xx" location="top">
                                                            <template v-slot:activator="{ props }">
                                                                    <v-text-field 
                                                                        v-bind="props"
                                                                        label="Твій номер телефону"
                                                                        prepend-icon="mdi-phone"
                                                                        @input="handleUserNumberInput"
                                                                        v-model="userPhone"
                                                                        :rules="rules.userNumber"
                                                                        >
                                                                        
                                                                    </v-text-field>
                                                            </template>
                                                        </v-tooltip>

                                                         <!-- Телефон Батьків -->
                                                         <v-tooltip text="(xxx)-xxx-xx-xx" location="top">
                                                            <template v-slot:activator="{ props }">
                                                                    <v-text-field 
                                                                
                                                                        v-bind="props"
                                                                        label="Номер телефону одого з батьків"
                                                                        prepend-icon="mdi-phone"
                                                                        @input="handleParentsNumberInput"
                                                                        v-model="motherFatherPhone"
                                                                        :rules="rules.motherFatherPhoneNumber"
                                                                        >
                                                                        
                                                                    </v-text-field>
                                                            </template>
                                                       </v-tooltip>
                                            
                                                        <!-- Емейл Батьків -->
                                                        
                                                        <v-text-field label="Email одного з батьків" clearable
                                                            :rules="rules.motherFatherEmail"
                                                            placeholder="johndoe@gmail.com"
                                                            prepend-icon="mdi-email"
                                                            v-model="motherFatherEmail"
                                                            ></v-text-field>
                                                                            
                                                            <!-- Пароль -->
                                                            <v-text-field  clearable
                                                                label="Пароль"
                                                                prepend-icon="mdi-lock-outline"
                                                                :rules="rules.userPassword"
                                                                @input="handlePasswordInput"
                                                                
                                                                v-model="userPassword"
                                                            ></v-text-field>
                                                        
                                                            <!--Аватарка  -->
                                                            <v-file-input
                                                                accept="image/png, image/jpeg, image/bmp"
                                                                placeholder="Pick an avatar"
                                                                prepend-icon="mdi-camera"
                                                                label="Avatar"

                                                              
                                                                @change="handleFileUpload"
                                                                >
                                                            </v-file-input>

                                                       <!-- alert -->
                                                            <v-row> 
                                                                <!-- alert error -->
                                                                <v-col cols="12">
                                                                    <v-alert v-if="showMessage === true &&  signSuccess === false"
                                                                    :text= textMessage
                                                                    type="error"
                                                                    variant="tonal"
                                                                    ></v-alert>
                                                                </v-col>
                                                                <!--alert success  -->
                                                                <v-col cols="12">                                                                 
                                                                    <v-alert v-if="showMessage === true &&  signSuccess === true"
                                                                    :title= textMessage
                                                                    type="success"
                                                                    variant="tonal"
                                                                  ></v-alert>
                                                                </v-col>
                                                            </v-row>
                                    <!-- col-2-row-1(buttons)  -->
                                        <v-row>
                                         
                                            <v-col no-gutters align="center" cols="12"  sm="6" md="" lg=""  xl="" >
                                               
                                          
                                                            <v-btn 
                                                            class="w-100"
                                                            type="submit" 
                                                            >
                                                            Зареєструватися
                                                           </v-btn>

                                               
                                            </v-col>

                                            <v-col no-gutters align="center" cols="12" sm="6" md="" lg=""  xl="" >
                                                        <v-btn  class="w-100" @click="toLogin">
                                                        

                                                            Увійти
                                                        </v-btn>
                                  
                                            </v-col>
            
                                           
                                        </v-row>
                             </form>
                            </v-col>
                </v-row>
                                                       
     </v-container>

     <!-- overlay -->
     <v-overlay  v-if="signSuccess"
        :model-value="overlay"
        class="align-center justify-center w-100"
   >
<!-- sheet  -->
<v-sheet elevation="12"  rounded="lg" width="100%" class="pa-4 text-center mx-auto" >


<!-- signSuccessFirst -->
                    <v-progress-circular v-if="signSuccessFirst"
                    
                        color="primary"
                        indeterminate
                        size="100"
                    ></v-progress-circular>
                   
                    <h1 v-if="signSuccessFirst" class="mb-4 text-medium-emphasis text-body-2">
                        Зачекайте триває перевірка інформації
                        </h1>

<!-- signSuccessSecond -->
                        <v-icon v-if="signSuccessSecond"
                        class="mb-5"
                        color="success"
                        icon="mdi-check-circle"
                        size="112"
                    ></v-icon>

                        <h1 v-if="signSuccessSecond" class="  mb-4 text-medium-emphasis text-body-2">
                            {{textMessage}}
                        </h1>

<v-divider class="mb-4"></v-divider>
</v-sheet>
   </v-overlay>
     

</div> 
</template>



<style scoped lang="scss">
.container{
width: 100%;
height: 100%;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
}


</style>


<script setup>
import { ref, watch,} from 'vue';
import { useRouter } from 'vue-router';

import axios from 'axios'


// import { vMaska } from "maska"
// const options = { mask: '+38(###)-###-##-##' };
// const myValue = ref('');


const userName = ref('');
const userLastName = ref('');
const motherFatherEmail = ref('');
const userPhone = ref('380');
const motherFatherPhone = ref('380');
const userPassword = ref('')


const imgFile = ref('');
const userImage = ref('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_TPQzrFZkEcel7SeRF7RQYtKNvaAAoJl2XM5U2ENNG8kzUwyLgQf-ypKIpZns1rtcex8&usqp=CAU');
const loading = ref(false)

const isValid = ref({

isUserNameValid: '',
isUserLastNameValid: '',
isMotherFatherEmailValid: '',
isUserPhoneValid: '',
isUserPasswordValid: '',
isMotherFatherPhoneValid: '', 
});

//error message
const showMessage = ref(false)
const textMessage = ref('')
//

//overlay
const overlay = ref(true)
const signSuccess = ref(false)
const signSuccessFirst = ref(false)
const signSuccessSecond = ref(false)
//

//router
const router = useRouter();




         

//================================================================================================
const submit = async  () => {
    console.log(isValid.isUserNameValid,
    isValid.isUserLastNameValid,
    isValid.isMotherFatherEmailValid,
    isValid.isUserPhoneValid,
    isValid.isUserPasswordValid,
    isValid.isMotherFatherPhoneValid)

    if( isValid.isUserNameValid === true &&  
    isValid.isUserLastNameValid === true && 
    isValid.isMotherFatherEmailValid === true && 
    isValid.isUserPhoneValid === true && 
    isValid.isUserPasswordValid === true && 
    isValid.isMotherFatherPhoneValid === true){
       
        const formData = new FormData();
        
        formData.append('avatar', imgFile.value);
        formData.append('name', userName.value.trim());
        formData.append('lastName', userLastName.value.trim());
        formData.append('userPhone', userPhone.value.replace(/[\(\)-]/g, ''));
        formData.append('motherFatherEmail', motherFatherEmail.value.trim());
        formData.append('motherFatherPhone', motherFatherPhone.value.replace(/[\(\)-]/g, ''));
        formData.append('password', userPassword.value.trim());

                            try {
                                //console.log([...formData.entries()]);
                                const response = await axios.post('http://localhost:3000/api/auth/register', formData);
                                //showMessage.value = true
                                textMessage.value = response.data.title
                                signSuccess.value = true//для оверлея
                                signSuccessFirst.value = true //для активації лоадера
                                        setTimeout(() => {
                                        signSuccessFirst.value = false
                                        signSuccessSecond.value = true 
                                        }, 2000);

                                        setTimeout(()=>{
                                            toLogin()
                                            showMessage.value = false
                                            textMessage.value = ''
                                            signSuccessSecond.value = false
                                            signSuccess.value = false
                                        },4000)

                            } catch (error) {
                                    showMessage.value = true
                                    textMessage.value = error.response.data.title
                                        setTimeout(()=>{
                                            showMessage.value = false
                                            textMessage.value = ''
                                        },2000)
                                }


        }else{
                                    showMessage.value = true
                                    textMessage.value = 'Заповніть усі поля'
                                        setTimeout(()=>{
                                            showMessage.value = false
                                            textMessage.value = ''
                                        },2000)

           }      
}


const toLogin = () => {
    router.push('/login') // для перехода на логин
}

const handleFileUpload = (event) =>{
    const file = event.target.files[0]
    imgFile.value = file
    //console.log(imgFile)
            if(file){
                const reader = new FileReader();

               
                            reader.onload = (e) => {
                                
                               loading.value = true
                            
                                        setTimeout(()=>{
                                           
                                            loading.value = false
                                            const imgUrl = e.target.result;
                                            userImage.value = imgUrl   
                                        },1000)

                            }
                reader.readAsDataURL(file);  
            }
 }
//================================================================
const handlePasswordInput = () => {
    if (userPassword.value.length > 20) {
        userPassword.value = userPassword.value.slice(0, 20);
  }
}

 const handleUserNumberInput = () => {
    if (userPhone.value.length > 12) {
    userPhone.value = userPhone.value.slice(0, 12);
  }
  if (userPhone.value.length < 4) {
    userPhone.value = '380'

}
 }

 const handleParentsNumberInput = () => {
    if (motherFatherPhone.value.length > 12) {
        motherFatherPhone.value = motherFatherPhone.value.slice(0, 12);
  }
  if (motherFatherPhone.value.length < 4) {
    motherFatherPhone.value = '380'

}
}

const rules = ref({





    userName: [
        value => {
            if (!value) {
                isValid.isUserNameValid = false
                return 'Заповніть поле'
            } else if (/[0-9,.;'[\]\\<>?:"{}|S]/.test(value)) {
                isValid.isUserNameValid = false
                return 'Введіть без цифр та спецсимволів '
            } else if (value.length > 20) {
                return 'Максимум 20 символів'
            } else {
                isValid.isUserNameValid = true
                return true
            }

        }

    ],
    userLastName: [

        value => {
            if (!value.length) {
                isValid.isUserNameValid = false
                return 'Заповніть поле'
            } else
                if (/[0-9,.;'[\]\\<>?:"{}|S]/.test(value)) {
                    isValid.isUserLastNameValid = false
                    return 'Введіть без цифр та спецсимволів '
                } else if (value.length > 20) {
                    return 'Максимум 20 символів'
                } else {
                    isValid.isUserLastNameValid = true
                    return true
                }

        }

    ],

    motherFatherEmail: [
        value => {
            const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
             isValid.isMotherFatherEmailValid = pattern.test(value)
            return pattern.test(value) || 'Некоректний Email'
            
        }
    ],
    userNumber: [


        value => {


          
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
    motherFatherPhoneNumber: [
        value => {
            if (!/^\d+$/.test(value)) {
              isValid.isMotherFatherPhoneValid = false;
              return 'Тільки цифри';
            } else {
              isValid.isMotherFatherPhoneValid = true;


              if (value.length < 12) {
                isValid.isMotherFatherPhoneValid = false;
                return 'Заполнено не полностью';
              } else {
                isValid.isMotherFatherPhoneValid = true;
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



</script>

