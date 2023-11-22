import axios from "axios";
import keys from "../../keys";
export default {
  state: {
    responseMessage: "",
    responseStatus: null,
    addWordsSelectedCategory: null,

    addWordsCategoryLabel: {
      name: "",
      categoryId: "",
      wordCount: null,
    },

    suggestionsEnglish: null,
  },

  actions: {
    async sendWords(ctx, data) {
      let message = "";
      let status = null;

      try {
        const newData = {
          inEnglish: data.inEnglish,
          inUkrainian: data.inUkrainian,
          inTranscription: data.inTranscription,
          categoryId: data.categoryId,
          categoryObj_Id: data.category._id,
        };

const token = localStorage.getItem("token");
if (!token) {
  throw new Error('Отсутствует токен');
  return
}



        const response = await axios.post( `${keys.host}/api/words/add-word`, newData, {
            headers: { 
              token: localStorage.getItem("token"),
              Authorization: `Bearer ${token}`
         },
          }
        );
      
        status = await response.status
        message = await response.data.message;
       ctx.commit("makeResponseMessage", message);
     
        ctx.commit('makeResponseStatus', status)
      } catch (error) {
        message = error.response.data.message;
        ctx.commit("makeResponseMessage", message);
      }
    },
    async checkWord(ctx, data){
      console.log(data)
      const words = await axios.get(`${keys.host}/api/words/check-english-word/${data}`)
      console.log(words)
      ctx.commit('makeEnSuggestion', words.data.suggestions)
    }
  },

  mutations: {
    makeResponseStatus(state, status){
   
     state.responseStatus = status
    },


makeEnSuggestion(state, data){
state.suggestionsEnglish = data
},




    makeAddWordsCategoryLabel(state, category) {
      state.addWordsCategoryLabel.name = category.name;
      state.addWordsCategoryLabel.categoryId = category.categoryId;
      state.addWordsCategoryLabel.wordCount = category.wordCount;
    },

    clearAddWordsCategoryLabel(state) {
      state.addWordsCategoryLabel.name = "";
      state.addWordsCategoryLabel.categoryId = null;
      state.addWordsCategoryLabel.wordCount = null;
    },


    
    makeResponseMessage(state, message) {
      state.responseMessage = message;
      setTimeout(() => (state.responseMessage = ""), 1000);
    },
    makeAddWordsSelectedCategory(state, selectedCategory) {
      state.addWordsSelectedCategory = selectedCategory;
    },
    clearAddWordsSelectedCategory(state) {
      state.addWordsSelectedCategory = null;
    },
  },

  getters: {
    getAddWordsResponseStatus(state){
      return state.responseStatus;
    },
    getMessage(state) {
      return state.responseMessage;
    },

    getAddWordsSelectedCategory(state) {
      return state.addWordsSelectedCategory;
    },
    getAddWordsCategoryLabel(state) {
      return state.addWordsCategoryLabel;
    },

    getEnSuggestion(state){
      return state.suggestionsEnglish
    }
  },
};
