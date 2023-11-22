<template>
    <div class="container">
            <header class="header">
                <span class="menu-button"></span>
                <headerComponent />
            </header>
            

            <main class="main">
              
                <nav class="nav-container" v-if=" isAuthorized === true">
                    <div class="router-link">  <router-link to="/addNewData" >addNewData</router-link>  </div>
                    <div class="router-link">  <router-link to="/wordsTest" >wordsTest</router-link>   </div>
                    <div class="router-link">  <router-link to="/wordsList" >wordsList</router-link>   </div>
                </nav>

                <RouterView />

            </main>
            


            <footer class="footer">
                <footerComponent />
            </footer>
    </div>



</template>

<style scoped lang="scss">
.container{
    display: flex;
    flex-direction: column;
    max-width: 1024px;
    min-height: 100vh;
    width: 100%;
   

            .header{
                display: flex;
                padding: 20px 20px;
                height: 100%;
                width: 100%;
                background-color: rgb(201, 198, 198);
                .menu-button{
                   display: none;
                   }
                            @media(max-width: 767px){
                                .menu-button{
                               
                                display: block;
                              
                                position: relative;
                                width: 30px;
                                border-top: 3px solid black
                                }
                                .menu-button::after{
                                content: '';
                                display: block;
                                position: absolute;
                                width: 100%;
                                border-top: 3px solid black;
                                top: 10px;
                                }
                                .menu-button::before{
                                    content: '';
                                    display: block;
                                    position: absolute;
                                    width: 100%;
                                    border-top: 3px solid black;
                                    top: -10px;
                                    }
                            }

            }
            .main{
                flex: 1 1 auto;
                height: 100%;
                width: 100%;
            
               display: flex;
              // background-color: rgb(245, 220, 187);
                 .nav-container{
                    padding: 5px 10px;
                    background-color: antiquewhite;
                    flex-direction: column;
                    background-color: aqua;
                    display: flex;
                    flex-direction: column;
                    gap:10px;
                    
                 }
                 @media (max-width: 767px) {
                    .nav-container {
                    position: absolute;
                    z-index: 100;
                    top: 0;
                    left: -100%;
                    }
                    }
                
            }
            .footer{
                display: flex;         
                padding: 20px 20px;
                height: 100%;
                width: 100%;
                background-color: rgb(201, 198, 198);

            }
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
        }
    },

//============================================================================
    mounted() {
    },

    created() {        
      this.$store.dispatch('getInfo')
    },

    methods: {
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


