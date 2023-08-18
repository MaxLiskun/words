import axios from "axios";
import keys from "../../keys";
export default {
  state: {
    responseMessage: "",
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

      try {
        const newData = {
          inEnglish: data.inEnglish,
          inUkrainian: data.inUkrainian,
          inTranscription: data.inTranscription,
          categoryId: data.categoryId,
          categoryObj_Id: data.category._id,
        };
        const response = await axios.post(
          `${keys.host}/api/words/add-word`,
          newData
        );
        message = await response.data.message;
        ctx.commit("makeResponseMessage", message);
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
