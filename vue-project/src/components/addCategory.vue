<template>
    <nav>
        <router-link class="router-link" to="/">Home</router-link> <br>
    </nav>
    <div class="addCategory">
        <input type="text" placeholder="Додати категорію" v-model="newCategory">
        <button @click="addCategory(newCategory)">OK</button> <br>
        {{ getCategoryMessage }}
    </div>


    <RouterView />
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
    name: 'addCategory',


    data() {
        return {
            newCategory: '',
        }
    },



    methods: {
        async addCategory(newCategory) {
            await this.$store.dispatch('addCategory', newCategory);
            this.newCategory = ''
            await this.$store.dispatch('getCategories')
            
        },

    },

    computed: {
        getCategoryMessage() {
            return this.$store.getters['getCategoryMessage']
        }


    },
    mounted() {

    }


}
</script>

