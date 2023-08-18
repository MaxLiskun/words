import axios from "axios";
import keys from "../../keys";
export default {
  state: {
    userWords: [],
    errorMessage: "",
    saveCategory: null,

    whatWordWasDeletedId: "",
    wordListSelectedCategory: null,

    wordListCategoryLabel: {
      name: "",
      categoryId: "",
      wordCount: null,
    },

    wordTryChange: null,
    wordListMessage: "",
  },

  actions: {
    async getUserWords(ctx, selectedCategory) {
      try {
        ctx.commit("makeWordListSelectedCategory", selectedCategory);
        ctx.commit("makeSaveCategory", selectedCategory);
        const response = await axios.post(`${keys.host}/api/words/get-words`, {
          selectedCategory: selectedCategory.categoryId,
        });

        ctx.commit("pushUserWords", response);
      } catch (error) {
        console.log(error);
        ctx.commit("makeResponseMessage", error);
      }
    },

    async deleteWord(ctx, id) {
      const response = await axios.delete(
        `${keys.host}/api/words/delete-word/${id}`
      );
      if (response.status === 200) {
        ctx.commit("setDeletedWordId", id);
        setTimeout(() => {
          ctx.dispatch("getUserWords", ctx.state.saveCategory);
        }, 500);
      }

      //
    },

    async getUserWord(ctx, _id) {
      const response = await axios.patch(
        `${keys.host}/api/words/get-word/${_id}`
      );
      ctx.commit("makeWordTryChange", response.data.word);
    },

    async changeWord(ctx, newWord) {
      try {
        let message = "";
        const response = await axios.patch(
          `${keys.host}/api/words/change-word/`,
          { newWord }
        );
        ctx.dispatch("getUserWords", ctx.state.saveCategory);
        message = response.data.message;
        console.log(message);
        ctx.commit("makeChangeWordMessage", message);
      } catch (error) {
        message = error.response.data.message;
        ctx.commit("makeChangeWordMessage", message);
      }
    },
  },

  mutations: {
    makeChangeWordMessage(state, message) {
      state.wordListMessage = message;
    },

    makeWordTryChange(state, data) {
      state.wordTryChange = data;
    },


    //
    makeWordListCategoryLabel(state, category) {
      state.wordListCategoryLabel.name = category.name;
      state.wordListCategoryLabel.categoryId = category.categoryId;
      state.wordListCategoryLabel.wordCount = category.wordCount;
    },
    clearWordListCategoryLabel(state) {
      state.wordListCategoryLabel.name = '';
      state.wordListCategoryLabel.categoryId = null;
      state.wordListCategoryLabel.wordCount = null;
    },

    //


    setDeletedWordId(state, id) {
      state.whatWordWasDeletedId = id;
      setTimeout(() => {
        state.whatWordWasDeletedId = null;
      }, 500);
    },
    pushUserWords(state, response) {
      state.userWords = response.data.data;
    },
    makeResponseMessage(state, message) {
      state.errorMessage = message;
      setTimeout(() => (state.responseMessage = ""), 1000);
    },
    makeSaveCategory(state, category) {
      state.saveCategory = category;
    },

    //
    makeWordListSelectedCategory(state, category) {
      state.wordListSelectedCategory = category;
    },
    clearWordListSelectedCategory(state) {
      state.wordListSelectedCategory = null;
    },
    //
    
    clearUserWords(state) {
      state.userWords = [];
    },
  },

  getters: {
    getWordListMessage(state) {
      return state.wordListMessage;
    },

    getWordTryChange(state) {
      return state.wordTryChange;
    },

    getWordListCategoryLabel(state) {
      return state.wordListCategoryLabel;
    },

    getWordListSelectedCategory(state) {
      return state.wordListSelectedCategory;
    },

    wordListMessage(state) {
      return state.errorMessage;
    },

    userWords(state) {
      return state.userWords;
    },
    getSaveCategory(state) {
      return state.saveCategory;
    },
    getWordMessage(state) {
      return state.wordMessage;
    },
    deletedWordId(state) {
      return state.whatWordWasDeletedId;
    },
  },
};
