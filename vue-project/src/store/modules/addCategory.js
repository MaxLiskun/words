import axios from "axios";
import router from "../../router/index";

import keys from "../../keys";
export default {
  state: {
    categoryMessage: null,
  },

  actions: {
    async addCategory(ctx, newCategory) {
      const userInfo = ctx.rootGetters["userInfo"];
      let message;
      const category = {
        name: newCategory,
        userId: userInfo.userId,
        categoryId: Date.now(),
      };
      try {
        const response = await axios.post(
          "http://localhost:3000/api/category/add-category",
          category
        );
        // console.log(response.data.message);
        message = response.data.message;

        ctx.commit("setCategoryMessage", message);
      } catch (error) {
        if (error.response) {
          // console.log(error.response.data.message);
          message = error.response.data.message;
          ctx.commit("setCategoryMessage", message);
        } else if (error.request) {
          //console.log("Сервер не відповідає(((");
          message = error.request;
          ctx.commit("setCategoryMessage", message);
        }
      }
    },
  },

  mutations: {
    setCategoryMessage(state, message) {
      state.categoryMessage = message;
      setTimeout(() => (state.categoryMessage = null), 1000);
    },
  },

  getters: {
    getCategoryMessage(state) {
      return state.categoryMessage;
    },
  },
};
