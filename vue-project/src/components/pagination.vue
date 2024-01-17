<template>
    <div>
      <div v-for="(item, i) in paginatedItems" :key="i">
        <v-card>{{ item }} {{ i }}</v-card>
        <br>
      </div>
  
      <v-pagination
        v-model="page"
        :length="Math.ceil(items.length / 5)"
      ></v-pagination>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  
  export default {
    setup() {
      const page = ref(1);
  
      const items = [
        'Item 2',
        'Item 3',
        'Item 4',
        'Item 5',
        'Item 6',
        'Item 7',
        'Item 8',
        'Item 9',
        'Item 10',
      ];
  
      const itemsOnPage = 5;
  
      const paginatedItems = computed(() => {
        const startIndex = (page.value - 1) * itemsOnPage;
        const endIndex = startIndex + itemsOnPage;
        return items.slice(startIndex, endIndex);
      });
  
      return {
        page,
        paginatedItems,
        items,
      };
    },
  };
  </script>
  