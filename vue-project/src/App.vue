<template>
    

    <div class="wrapper" :class="{'not-active': isMenuOpen === true}" >
        

            <div class="overlay" 
                  v-if="isMenuOpen"
                   @click="openMenuTrigger">

            </div>

            <header class="header" :class="{'notActive': isMenuOpen === true}">
                <div class="header-container">
                      
                                <div class="header-container__menu-button">
                                    <font-awesome-icon icon="fa-solid fa-bars" size="2xl" v-if="isAuthorized === true" @click="openMenuTrigger"/></div>
                              
                                   <headerComponent />
                            
                            
                </div>
                
            </header>            
            <div class="layout bg-grey-lighten-4" :class="{'notActive': isMenuOpen === true}" >
                        <!--  -->
                            <div class="layout__nav" v-if="isAuthorized === true" :class="{'open-layout-nav': isMenuOpen === true}">
                                                                
                                       <!--  -->
                                            <span class="layout-nav__exit"   @click="openMenuTrigger">
                                                <font-awesome-icon icon="fa-solid fa-xmark" size="2xl" />
                                                </span> 
                                       
                                        
                                        <ul class="layout-nav__links">

                                            <li>
                                                <font-awesome-icon icon="fa-solid fa-home"  />
                                              
                                                <a class="router-link" @click="closeMenuAndNavigate('/')">landing </a>
                                            </li>  

                                            <li>
                                                <font-awesome-icon icon="fa-solid fa-bolt"  />
                                                <a class="router-link" @click="closeMenuAndNavigate('/wordsTest')">wordsTest</a>
                                            </li>
                                        

                                            <li>
                                                <font-awesome-icon icon="fa-solid fa-book-open" />
                                                <a class="router-link" @click="closeMenuAndNavigate('/wordsList')">wordsList</a>
                                            </li>

                                            <li>
                                                <a class="router-link" @click="closeMenuAndNavigate('/pagination')">pagination</a>
                                            </li>

                                            <!-- <li><a class="router-link" @click="closeMenuAndNavigate('/addNewData')">addNewData</a></li> -->
                                          

                                           
                                        </ul>

                                       <!--  -->
                                     
                                       <addWords/>
                              
                            </div>
                          <!--  -->
                             <div class="layout__content">
                           
                              

                                <RouterView />
                            </div>
                            
                           
            </div>
                  

    </div>

 
</template>

<style scoped lang="scss">
$border-color: rgb(197, 194, 194);

$header-background-color: rgb(145, 139, 139);
$header-color: rgb(255, 255, 255);


$router-link-color: rgb(7, 7, 7);
$router-link-background: rgb(46, 46, 48);

$router-link-hover-color: rgb(255, 255, 255);
$router-link-hover-background: rgb(179, 179, 187);
//wrapper

.wrapper{
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
 
}
//header
.header {
    width: 100%;
    position:fixed;
    top: 0;
    left: 0;
    height: 70px;
    width: 100%;
    background-color: $header-background-color;
    color: $header-color;
    border-bottom: 1px solid $border-color;
    z-index: 997;
  
   
              .header-container{
                 max-width: 1600px;
                 margin: 0 auto;
                 width: 100%;
                 height: 100%;
                 padding: 10px;
                 display: flex;
                 align-items: center;
                 justify-content: flex-end;              
                 
                            .header-container__menu-button{
                                display: none;
                            }

               
             }
           
}
  

//layout

.layout {
position: relative;
max-width: 1600px;
margin: 0 auto;
height: 100%;
width: 100%;
min-height: 100vh;

padding-top: 70px;

display: flex;


.layout__nav {
    list-style: none;
    min-width: 300px;
    
    border-right: 1px solid $border-color;
    display: flex;
    flex-direction: column;
    overflow: auto;
            
            .layout-nav__links{
                border-bottom: 1px solid $border-color;
                    li{
                        padding: 5px;
                        display: flex;
                        align-items: center;
                        justify-content: flex-start;
                             &:hover{
                                background-color: $router-link-hover-background;
                                cursor:pointer;
                             }
                        a{
                            width:100% ;
                            color: $router-link-color;
                            text-decoration: none;
                            display: block;
                            padding-left: 2px;
                            transition: all .1s ease;
                             
                        }
               
                    }
            }        
            .layout-nav__exit{
                display: none;
            }
}

.layout__content {
width: 100%;
height: 100%;
flex: 1 1 100%;
padding: 5px 5px;
}

}



//helpers
.not-active{
height: 100vh;
overflow: hidden;
}
.overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
/* Задайте желаемый цвет и прозрачность затемнителя */
z-index: 998;
/* Убедитесь, что затемнитель находится выше других элементов, но ниже меню */
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
}









//media <1024////////////////////////////////

@media (max-width: 1024px){

   
.header{
    .header-container{
        justify-content: space-between;  
        .header-container__menu-button{
            display: block;
            
        }
    }

}

.layout {
   
    
            
    .layout__nav {
        position: absolute;
        top: 0;
        left:0;
        height: 100%;
        background-color: white;
        left: -310px;
        z-index: 999;
        transition: all .3s ease;
       
       
                
                .layout-nav__links{
                   
                        li{
                            
                            a{
                             
                                &:hover{
                                    cursor: pointer;
                                  
                                }
                            }
                   
                        }
                }        
                .layout-nav__exit{
                    display: block;
                    align-self: flex-end;
                    padding: 5px;
                }
    }
    .open-layout-nav{
        left: 0 ;
    } 
    .layout__content {
  
    }
    
    }
    

}

    
 


</style>





<script>
import { RouterLink, RouterView } from 'vue-router'
import headerComponent from './components/headerComponent.vue'
import footerComponent from './components/footerComponent.vue'
import addWords from './components/addWords.vue'
import addCategory from './components/addCategory.vue'
import addNewData from './pages/wordsTest.vue'

export default {
    name: "App",
    components: {
        headerComponent,
        footerComponent,
        addWords,
       
        

    },



    data() {
        return {
            isAuthorized: false,
            isMenuOpen: false,
        }
    },

//============================================================================
    mounted() {
    },

    created() {        
      this.$store.dispatch('getInfo')
    },

    methods: {
        openMenuTrigger(){
         this.isMenuOpen = !this.isMenuOpen
        },
        closeMenuAndNavigate(path){
            this.isMenuOpen = false;
            this.$router.push(path)
        }
    },
 

    computed: {
        getIsAuthorized(){
            return this.$store.getters['getIsAuthorized']
        }
    },

    watch: {
        getIsAuthorized(newValue){
            this.isAuthorized = newValue
        }
    }

}

</script>


