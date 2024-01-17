import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../components/Landing.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    
    {
      path: '/pagination',
      name: 'pagination',
      component: () => import('../components/pagination.vue'),
      meta: {
       title: 'pagination',
      }
     },







    {
      path: '/',
      name: 'landing',
      component: Landing
    },

    {
      path: '/wordsList',
      name: 'wordsList',
      component: () => import('../pages/wordsList.vue'),
      meta: {
       title: 'wordList',
      }
     },



  



    {
      path: '/wordsTest',
      name: 'wordsTest',
      component: () => import('../pages/wordsTest.vue'),
      meta: {
       title: 'wordTest',
      }
     },

 
     {
      path: '/addNewData',
      name: 'addNewData',
      beforeEnter: (to, from,next) => {
        if(1<2){
          next()
        }else{
          next('./login')
        }
      },
      component: () => import('../pages/addNewData.vue'),
      meta: {
       title: 'addNewData',
      }
     },
    

  

    {
      path: '/signup',
      name: 'signup',
   
      component: () => import('../components/Signup.vue'),
      meta: {
        title: 'Signup page'
      }
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../components/Login.vue'),
      meta: {
        title: 'Login page'
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
