<template>
    <div class="container">
        <div class="category__header">
            <div class="category__header-label label">
              
                <span class="label__item">
                         <slot name="categoryLabel"></slot>
                </span>
               
            </div>
            <div class="category__header-arrow" v-if="getCategories.length" @click="toggleButton"
                :class="{ 'active': isButtonActive }">
                <span class="material-symbols-sharp" :class="{ 'open': isButtonActive }">
                    expand_more
                </span>
            </div>
        </div>


        <div class="category__item-container" :class="{ 'open': isButtonActive }">
            <div class="category__item" v-for="category in getCategories" :value="category" :key="category._id">
                <span class="category-name" @click=" emitCategoryChange(category)"> {{ category.name }} </span>


               <div class="category-item-length">
                    <span v-if="category.wordCount">({{ category.wordCount }})</span>
                    <span v-else>(0)</span>
                </div>



                <span v-if="getDeleteCategoryId === category.categoryId">{{ getCategoryDeleteMessage }}</span>




                <div class="renameCategory-container" v-if="category.categoryId === getCategorySaveId">

                    <span><input type="text" v-model="newNameCategory" :placeholder="renamePlaceholder"
                            v-if="getRenameCompleted"></span>
                    <span>{{ getRenameCategoryMessage }}</span>
                    <span @click="changeNameOfCategory(category)" v-if="getRenameCompleted"> ok</span>
                </div>


                <div class="category-nav">

                    <span class="material-symbols-sharp" @click="renameCategory(category)"><span
                            class="edit_note">edit_note</span></span>

                    <span class="material-symbols-sharp" @click="deleteCategory(category)">
                        <span class="delete_note"> delete</span>
                    </span>
                </div>
            </div>
        </div>

    </div>
</template>
<style scoped>
input {
    border: 1px solid #cccccc;
    border-radius: 3px;

    padding: 3px;
    margin: 2px;



}

.container {
    display: block;
    position: relative;
    height: 100%;
    max-width: 500px;
    z-index: 100%;
    overflow: hidden;

}

.category__header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 200;
    padding: 5px 0px 5px 10px;
    border: 1px solid rgb(214, 207, 207);
    border-radius: 5px;
    background-color: aliceblue;
    flex: 0 1 20%;
}

.category__header-label {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;


}


.category__item-container {
    position: relative;
    transition: all .3s ease-in-out;
    top: -210px;
    left: 0%;
    width: 100%;
    height: 300px;
    padding: 5px;
    max-height: 200px;
    overflow: auto;
    height: 0;
}

.category__item {

    border-bottom: 1px solid rgb(204, 199, 199);
    padding: 2px 3px 2px 3px;
    min-height: 10px;

    display: flex;
    justify-content: space-between;
    align-items: center;

}

.category-name {
    display: block;
}

.category-name:hover {
    background-color: red;
}

.open {
    top: 0;
    transition: all .3s ease-in-out;
    margin-top: 0%;
    height: 100%;
}

.material-symbols-sharp.open {
    transform: rotate(180deg);
    background-color: rgb(253, 7, 7);
}

.material-symbols-sharp {

    cursor: pointer;
    font-size: 25px;
    transition: all .3s ease;
    text-align: center;
    border-radius: 3px;
}

.category-name {
    display: block;
    padding: 4px 10px;
    cursor: pointer;
}

.edit_note:hover {
    color: red;
}

.delete_note:hover {
    display: block;
    color: red;
}
</style>

<script>
export default {
    name: 'categoryList',
    props: ['value'],

    data() {
        return {
            isButtonActive: false,
            selectedCategory: this.value,
            categories: [],
         
         
            newNameCategory: '',
            isCategorySaveId: null,
            renamePlaceholder: 'Введи назву',

        }
    },
    methods: {
        renameCategory(category) {
            this.$store.commit('resetRenameCompleted', true)

            if (this.getCategorySaveId === category.categoryId) {
                this.$store.commit('clearCategorySaveId')
            } else {
                this.$store.commit('makeCategorySaveId', category.categoryId)
            }
        },

        changeNameOfCategory(category) {

            if (this.newNameCategory) {

                const data = {
                    newNameCategory: this.newNameCategory,
                    categoryId: category.categoryId
                }
                this.$store.dispatch('renameCategory', data)

            } else {
                this.renamePlaceholder = 'Ви не ввели назву!!!'
                setTimeout(() => { this.renamePlaceholder = 'Введи назву' }, 1000)
            }



        },

        toggleButton() {
            this.$store.commit('resetRenameCompleted', false)
            this.isButtonActive = !this.isButtonActive
        },


        emitCategoryChange(category, categoryLabel) {
           this.selectedCategory = category
            this.categoryLabel = category.name
          //  console.log(category)
            this.$emit('category-change', category, category.categoryLength);

            this.isButtonActive = false

        },


        async deleteCategory(category) {

            await this.$store.dispatch('deleteCategory', category)
            await this.$store.dispatch('getCategories')


            this.$store.commit('clearAddWordsSelectedCategory')
            this.$store.commit('clearAddWordsSelectedCategory')

            this.$store.commit('clearAddWordsCategoryLabel')
            this.$store.commit('clearWordListCategoryLabel')

            this.$store.commit('clearWordListCategoryLabel')
            this.$store.commit('clearWordListSelectedCategory')
            this.$store.commit('clearUserWords')

            

        }
    },

    mounted() {
        this.$store.dispatch('getCategories')

    },
    computed: {

        getCategorySaveId() {
            return this.$store.getters['getCategorySaveId']
        },

        getCategoryLabel() {
            return this.$store.getters['getCategoryLabel']
        },
        getCategories() {

            return this.$store.getters['stateCategories']
        },
        getCategoryDeleteMessage() {
            return this.$store.getters['getCategoryDeleteMessage']
        },
        getDeleteCategoryId() {
            return this.$store.getters['getDeleteCategoryId'];
        },
        getRenameCategoryMessage() {
            return this.$store.getters['getRenameCategoryMessage']
        },
        getRenameCompleted() {
            return this.$store.getters['getRenameCompleted']
        },

    },
    watch: {
        getCategoriesLength(length) {
         
            this.isButtonActive = false
            this.categoryLabel = ''

        },
       

    }
}

</script>