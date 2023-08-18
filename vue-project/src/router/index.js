import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../components/Landing.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing
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
      component: () => import('../pages/addNewData.vue'),
      meta: {
       title: 'addNewData',
      }
     },
    

  

    {
      path: '/signup',
      name: 'signup',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
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
