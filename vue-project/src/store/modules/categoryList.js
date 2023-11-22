import axios from "axios";
import keys from "../../keys";
import { RouterLink, RouterView } from 'vue-router'



export default {
  state: {
    categories: [],
    selectedCategory: null,

    deleteCategoryMessage: null,
    renameCategoryMessage: null,
    renameCompleted: false,

    deleteCategoryId: null,
    categorySaveId: null,

    
  },

  actions: {

    async getCategories(ctx, router) {
     
     try {
    
      const token = localStorage.getItem("token")

      const userInfo = await ctx.rootGetters["userInfo"];

      const response = await axios.post( `${keys.host}/api/category/get-categories`, userInfo,{
        headers: { 
         token: localStorage.getItem("token"),
         Authorization: `Bearer ${token}`
     },
      })

    

   
       await ctx.commit("updateStateCategories", response.data.categoriesWithWordCount);
     } catch (error) {
      if(error.response.status === 401){
        router.push('/login') // для перехода на логин
        localStorage.clear();
        this.$store.commit('clearUser');
        
      }
     }




 
      
    
    
    
      
    },

    async deleteCategory(ctx, category) {
      let message = "";
      try {
        const response = await axios.delete(
          `${keys.host}/api/category/delete-category/${category.categoryId}`
        );

        message = response.data.message;
        ctx.commit("makeDeleteCategoryId", category.categoryId);
        ctx.commit("makeDeleteCategoryMessage", message);
        setTimeout(() => {
          ctx.dispatch("getCategories");
        }, 800);
      } catch (error) {
        ctx.commit("makeDeleteCategoryMessage", error);
      }
    },

    async renameCategory(ctx, data) {
      let message = "";
      try {
        const response = await axios.post(
          `${keys.host}/api/category/rename-category`,
          { data }
        );

        message = response.data.message;

        ctx.commit("makeRenameCategoryMessage", message);
        ctx.commit("resetRenameCompleted", false);

        ctx.commit("clearAddWordsCategoryLabel");
        ctx.commit("clearAddWordsSelectedCategory");

        ctx.commit("clearWordListCategoryLabel");
        ctx.commit("clearWordListSelectedCategory");

        ctx.commit("clearUserWords");

        setTimeout(() => {
          ctx.commit("clearCategorySaveId");
        }, 800);
        await setTimeout(() => {
          ctx.dispatch("getCategories");
        }, 800);
      } catch (error) {
        message = error.response.data.message;
        ctx.commit("makeRenameCategoryMessage", message);
        ctx.commit("resetRenameCompleted", true);
      }
    },
  },

  mutations: {
    makeCategorySaveId(state, id) {
      state.categorySaveId = id;
    },
    clearCategorySaveId(state) {
      state.categorySaveId = null;
    },
    resetRenameCompleted(state, trueOrFalse) {
      state.renameCompleted = trueOrFalse;
    },
    makeRenameCategoryMessage(state, message) {
      state.renameCategoryMessage = message;
      setTimeout(() => {
        state.renameCategoryMessage = " ";
      }, 1000);
    },
    makeDeleteCategoryId(state, categoryId) {
      state.deleteCategoryId = categoryId;
    },
    makeDeleteCategoryMessage(state, message) {
      state.deleteCategoryMessage = message;
    },
    updateStateCategories(state, data) {
    state.categories = data;
    },
    updateCategoryListSelectedCategory(state, data) {
      state.selectedCategory = data;
    },
  },

  ////////////////////////
  getters: {
   getCategoriesLength(state){
     return state.categories.length
   },

    getCategorySaveId(state) {
      return state.categorySaveId;
    },

    getRenameCompleted(state) {
      return state.renameCompleted;
    },

    getRenameCategoryMessage(state) {
      return state.renameCategoryMessage;
    },

    getDeleteCategoryId(state) {
      return state.deleteCategoryId;
    },

    stateCategories(state) {
      return state.categories;
    },

    getCategoryListSelectedCategory(state) {
      return state.selectedCategory;
    },
    getCategoryDeleteMessage(state) {
      return state.deleteCategoryMessage;
    },
  },
};
