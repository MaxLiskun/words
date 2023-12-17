<template>
    <div class="container " >
        <!--isNotSelected передаем в props  -->
        <div class="category__header" :class="{ 'isNotSelected': isNotSelected }"> 
            
            <div class="category__header-label label">
              
                <span class="label__item">
                         <slot name="categoryLabel"></slot>
                </span>
               
            </div>
            <div class="category__header-arrow" v-if="getCategories.length" @click="toggleButton"
                :class="{ 'active': isButtonActive }">
                <span class="material-symbols-outlined" :class="{ 'open': isButtonActive}">
                    expand_more
                </span>

               
            </div>
        </div>


    <div class="category__item-container" :class="{ 'open': isButtonActive === true}">

          <!-- item -->
                <div class="category__item" v-for="category in getCategories" :value="category" :key="category._id">

                        
                            <div class="item-main">
                                    <div class="item-main__info">
                                                <div class="item-main-info__name" @click=" emitCategoryChange(category)"> {{ category.name }} </div>
                                                <div  class="item-main-info__length">
                                                            <div class="info-length__item" v-if="category.wordCount">({{ category.wordCount }})</div>
                                                            <div class="info-length__item" v-else>(0)</div>
                                                    </div>
                                    </div>
                        
                                    
                                    <div class="item-main__nav">
                                        <span class="item-main-nav__edit-note   material-symbols-outlined" @click="renameCategory(category)">edit_note</span>
                                        <span class="item-main-nav__delete-note material-symbols-outlined" @click="deleteCategory(category)">delete</span>
                                    </div>             
                                      
                                     
                            </div>

                             <!--  -->

                           <div class="item-rename" v-if="category.categoryId === getCategorySaveId">

                                 <div class="item-rename__main">

                                            <input class="item-rename-main__input" type="text" v-model="newNameCategory" :placeholder="renamePlaceholder"
                                            v-if="getRenameCompleted">
                                
                                            <span  class="item-rename-main__button" @click="changeNameOfCategory(category)" v-if="getRenameCompleted"> ok</span>
                                           
                                        </div>
                                             

                                 <div class="item-rename__message">
                                          <span class="item-rename-group-2__message">{{ getRenameCategoryMessage }}{{checkCategoryMessage }}</span>
                                          
                                 </div>

                           </div>
                            <!--  -->


                            
                           <div class="item-message">           
                                 <div class="item-message__delete" v-if="getDeleteCategoryId === category.categoryId">{{ getCategoryDeleteMessage }}</div>
                            </div>

       
                </div>
        <!-- /item -->


    </div>

    </div>
</template>
<style lang="scss" scoped>



.container {
    display: block;
    position: relative;
    //height: 100%;
    width: 100%;
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
    background-color: rgb(232, 231, 227);
    word-break: break-all;
    border-radius: 5px;
   
}
.category__header-arrow{
    margin: 0 5px;
}


.category__item-container {
    position: relative;
    transition: all .2s ease-in-out;
    top: -210px;
    left: 0%;
    width: 100%;
    height: 300px;
    padding: 5px;
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    height: 0;
    opacity: 0;
    //overflow: hidden;
  // background-color: rgb(249, 249, 243);
                &::-webkit-scrollbar-track {
                    background-color: #e5e1e1; /* Цвет фона трека (полосы прокрутки) */
                }
                &::-webkit-scrollbar {
                    width: 5px;
                }
                &::-webkit-scrollbar-thumb {
                    background-color: rgb(155, 153, 162); /* Измененный цвет при наведении */
                    border-radius: 10px;
                }

                &::-webkit-scrollbar-thumb:hover {
                    background-color: orange; /* Измененный цвет при наведении */
                }
     
}


.open {
    top: 0;
    opacity: 1;
    transition: all .3s ease-in-out;
    height: 100%;
   
}

.material-symbols-outlined.open {
    transform: rotate(180deg);
   // background-color:  rgb(255, 7, 7);
}

.material-symbols-outlined{

    cursor: pointer;
    font-size: 20px;
    transition: all .3s ease;
    text-align: center;
    border-radius: 3px;
}

.isNotSelected{
    background-color:  rgb(255, 7, 7);
    transition: all 0.5s ease;
    
   
}

//================================================================
.category__item {
    display: flex;
    border-bottom: 1px solid grey;
    width:100%;
    height: 100%;
    flex-direction: column;
    padding: 5px ;
}

//item-main
.item-main {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: space-between;
    
  
  
            .item-main__info{
             width: 100%;
             max-width: 80%;
             height: 100%;
             display: flex;
           
         
                    .item-main-info__name{
                        width: 100%;
                        overflow: hidden;         /* Скрыть часть текста, выходящую за пределы контейнера */
                        text-overflow: ellipsis;
                        word-wrap: break-word;
                                &:hover{
                                    color: red;
                                    cursor: pointer;
                                }
                    }
                     .info-length__item{
                        font-weight: bold;
                        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
                     
                    }
            }

         

            .item-main__nav{
             display: flex;
             align-items: center;
             justify-content: center;
          

                .item-main-nav__delete-note, 
                .item-main-nav__edit-note{
                            &:hover{
                                color: red;
                            }
                }


            }
}
//item-main-end

//item-rename
.item-rename{
    padding: 10px 2px;
    .item-rename__main{
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
                .item-rename-main__input{
                    width: 100%;
                    flex: 0 1 80%;
                    border: 1px solid rgb(165, 164, 164);
                    border-radius: 4px;
                    padding: 2px 5px; 
                            &:focus{
                                outline: none;
                              
                            }
                }
                .item-rename-main__button{
                    font-size: 13px;
                    text-transform: uppercase;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2px 8px;
                    border-radius: 5px;
                    background-color: rgb(233, 230, 230);
                    transition: all 0.3s ease;
                        &:hover{
                            background-color: rgb(248, 170, 24);
                            cursor: pointer;
                        }
                    

                }
    }
    .item-rename__message{
        text-align: center;
        font-size: 12px;
    }
}
//item-rename-end
</style>

<script>
import {checkCategory} from '../store/modules/helpers.js'
import {makeFirstBigLetterAndAfterPoint} from '../store/modules/helpers.js'
export default {
    name: 'categoryList',
   // props: ['value'],
   
   props: {
    value: 'value', 
    isNotSelected: false,  
    
  },

    data() {
        return {
            newCategoryIsValid: false,
            checkCategoryMessage: '',

            isButtonActive: false,
            selectedCategory: this.value,
            categories: [],
            categoriesLength: null,
         
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
        console.log(category)

            if (this.newCategoryIsValid) {
               
               //this.newNameCategory = this.newNameCategory.charAt(0).toUpperCase() + this.newNameCategory.slice(1)
               
                const data = {
                    newNameCategory: makeFirstBigLetterAndAfterPoint(this.newNameCategory),
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
     
            if(this.getCategoriesLength <= 0){
                this.isButtonActive = false
            }

        }
    },

    mounted() {
        this.$store.dispatch('getCategories', this.$router)


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
        getCategoriesLength(){
            return this.$store.getters['getCategoriesLength'];
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
      
        newNameCategory(newNameCategory) {
            console.log(newNameCategory.length)
            this.checkCategoryMessage =''
            if (newNameCategory.trim().length > 0) {
                this.checkCategoryMessage = ''
                const checked = checkCategory(newNameCategory)
                this.newCategoryIsValid = checked.isValid
                this.checkCategoryMessage = checked.message
            } else {
                this.newNameCategory = ''
            }

        },
        getCategoriesLength(newValue){
           this.categoriesLength = newValue
        }
      
       

    }
}

</script>