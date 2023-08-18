<template>
  <div>

    <addCategory />
    <addWords />
    <wordsList/>
   
   
  </div>


 

  <RouterView />
</template>


<script>
import { RouterLink, RouterView } from 'vue-router'

import addCategory from '../components/addCategory.vue'
import addWords from '../components/addWords.vue'
import wordsList from '../components/wordsList.vue'
import categoryList from '../components/categoryList.vue'


export default {

  name: 'addNewData',

  components: {
    addCategory,
    addWords,
    wordsList,
    categoryList,
   
  }


}
</script>