<template>
  
    <div class="addCategory-container ">
           <div class="addCategory-main">
                 <input ref="addCategoryInput" class="addCategory-main__input" 
                 
                 @blur="addCategoryInputIsDisabled"
                 @focus="addCategoryInputIsActive"

                 :class="{'red': !categoryIsValid && newCategory.length, 'green': categoryIsValid && newCategory.length}"  
                 
                 type="text" placeholder="Додати категорію" v-model="newCategory">
                 
                 <span class="addCategory-main__button"   @click="addCategory(newCategory)">OK</span> 
           </div>
       
           <div class="addCategory-message">
                     <div class="addCategory-message__message"> {{ addCategoryMessage }}</div>
            </div>
     
    </div>


   
</template>


<style lang="scss">
.addCategory-container {
display: flex;
flex-direction: column;
width: 100%;

padding: 5px 0px;

}
.addCategory-main {
display: flex;
width: 100%;
justify-content: space-between;
gap: 5px;


		// .addCategory-main__input

		&__input {
            width: 100%;
            max-width: 80%;
            padding-left: 5px;
            border: 1px solid rgb(187, 180, 180);
            border-radius: 5px;
             &:focus{
               outline: none;
             box-shadow: 0px 0px 5px grey;
             }
		}

		// .addCategory-main__button

		&__button {
            display: flex;
            padding: 5px 10px;
            background-color: rgb(235, 232, 232);
            border-radius: 5px;
            transition: all 0.3s ease;
            cursor: pointer;
                &:hover{
                    background-color: orange;
                    transition: all 0.3s ease;
                }
          
		}
}
.addCategory-message {
    padding: 5px 0px;
		// .addCategory-message__message

		&__message {
            text-align: center;
            font-size: 12px;
		}
}

.green{
    background-color: rgb(205, 231, 205);
  
}
.red{
    background-color: rgb(234, 199, 199);
}





</style>



<script>
import { RouterLink, RouterView } from 'vue-router'
import {checkCategory} from '../store/modules/helpers.js'
import { makeFirstBigLetterAndAfterPoint } from '../store/modules/helpers.js'
export default {
    name: 'addCategory',


    data() {
        return {
            newCategory: '',
            addCategoryMessage: '',
            categoryIsValid: false,
        }
    },





    methods: {
        async addCategory(newCategory) {
              if(this.categoryIsValid){
              
          
                await this.$store.dispatch('addCategory', makeFirstBigLetterAndAfterPoint(newCategory))
                this.newCategory = ''
                await this.$store.dispatch('getCategories')
                this.addCategoryMessage = this.getCategoryMessage
                this.categoryIsValid = false
              }
    },
},


    computed: {
        getCategoryMessage() {
            return this.$store.getters['getCategoryMessage']
        }


    },
    mounted() {

    },
    watch:{
        getCategoryMessage(newMessage) {
            this.addCategoryMessage = newMessage
        },

        newCategory(category) {
                if(category.trim().length > 0){
                    const checked = checkCategory(category);
                    this.categoryIsValid = checked.isValid
                    this.addCategoryMessage = checked.message
                }else{
                    this.newCategory = ''
                    this.addCategoryMessage = ''
                }
        }
    }


}
</script>

