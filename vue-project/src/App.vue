<template>
    

    <div class="wrapper">
        <nav class="nav" v-if="isAuthorized === true" :class="{'open': isMenuOpen === true}">
            <button  @click="openMenuTrigger">exit</button>                   
    
        <a class="router-link" @click="closeMenuAndNavigate('/')">landing</a>
        <a class="router-link" @click="closeMenuAndNavigate('/addNewData')">addNewData</a>
        <a class="router-link" @click="closeMenuAndNavigate('/wordsTest')">wordsTest</a>
        <a class="router-link" @click="closeMenuAndNavigate('/wordsList')">wordsList</a>
        
        
        
        </nav>


        
    <div class="container" >
               
     

        <header class="header" :class="{'notActive': isMenuOpen === true}">
     
                        <span class="menu-button" 
                            v-if="isAuthorized === true"  
                            @click="openMenuTrigger">
                            MENU
                        </span>
                        <headerComponent />
        </header>
                            
                        
    
        <main class="main" :class="{'notActive': isMenuOpen === true}" >
        <RouterView />
        </main>

        <footer class="footer" :class="{'notActive': isMenuOpen === true}">
        <h1>footer</h1>
        </footer>
            


</div>

    </div>
  





  



</template>

<style scoped lang="scss">
.wrapper{
    height: 100vh;
   
}

.container{
display: flex;
flex-direction: column;
height: 100%;
width: 100%;
overflow: hidden;



}
.header{
    flex: 0 1 auto;
width: 100%;
height: 10%;
background-color: bisque;
}

.nav{
position: absolute;
top: 0;
left: -30%;
background-color: chocolate;
display: flex;
flex-direction: column;
width: 30%;
height: 100%;
z-index: 999;
transition: all 1s ease;

}
.open{


left: 0;
}

.main{
width: 100%;
min-height: 100%;
flex: 1 0 100%;
background-color: rgb(215, 229, 194);

}

.footer{
flex: 0 1 20%;
background-color: blueviolet;
height: 15%;
}


</style>





<script>
import { RouterLink, RouterView } from 'vue-router'
import headerComponent from './components/headerComponent.vue'
import footerComponent from './components/footerComponent.vue'

export default {
    name: "App",
    components: {
        headerComponent,
        footerComponent

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


