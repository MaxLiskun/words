<template>
    <div v-if="!loading">

      <div v-for="(item) in paginatedItems" >
       <slot  name="card-content" :item="item"></slot>
      
      </div>


  
      <v-pagination 
        v-model="page"
        :length="Math.ceil(data.length / itemsOnPage)"
      ></v-pagination>



      
    </div>

    <div class="text-center" v-else>
      <v-progress-linear color="primary" indeterminate></v-progress-linear>
    </div>
   
  </template>
  
  <script setup>
  import { ref, computed, defineProps, watchEffect, onMounted, defineEmits  } from 'vue';


  const { data,} = defineProps(['data',]);


  const emits = defineEmits();
  


      const loading = ref('false')
      const page = ref(1);
      const itemsOnPage = 1;        //керування кількістю елементів на сторінці!!!
      const loadingTime = ref(1100)  //затримка для сторінок!!!!
    


      const paginatedItems = computed(() => {
              const startIndex = (page.value - 1) * itemsOnPage;//  0
              const endIndex = startIndex + itemsOnPage; // 3
              window.scrollTo(0, 0); // для того щоб сторінка піднімалася догори
            
              if(!loading.value) {
                return data.slice(startIndex, endIndex);
        
        }
      


      });


// якщо сторінку перегортаєш то loading true а через затримку 200 
watchEffect(()=>{
  if(page.value){
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, loadingTime.value);                   

  }
})
    

  
   
  
  </script>
  