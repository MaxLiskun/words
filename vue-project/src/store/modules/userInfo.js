import axios from "axios";
import router from "../../router/index";

export default {
  state: {
    userInfo: {
      name: "",
      email: "",
      userId: "",
    },
  },
  actions: {
    async getInfo(ctx) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Отсутствует токен');
        }
        const candidate = await axios.get(
          "http://localhost:3000/api/user/info",
          {
            headers: { token: localStorage.getItem("token"),
            Authorization: `Bearer ${token}`
           },
          
          }
        );
        const user = candidate.data.decoded;
       
        ctx.commit("makeUser", user);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("упссс");
          router.push("/login");
        }
      }
    },
  },

  mutations: {
    makeUser(state, user) {
  
      state.userInfo.name = user.name;
      state.userInfo.email = user.email;
      state.userInfo.userId = user.userId;
      // state.userInfo = { ...state.userInfo, ...user };
    },
    clearUser(state) {
      state.userInfo.name = "";
      state.userInfo.email = "";
      state.userInfo.userId = "";
    },
  },

  getters: {
    userInfo(state) {
      return state.userInfo;
    },
  },
};
