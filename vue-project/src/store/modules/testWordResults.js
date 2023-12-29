import axios from "axios";
import router from "../../router/index";
import keys from "../../keys";
export default {
  state: {
  resultsOfWordTest: [],
  },



  actions: {
    async getWordTestResults(ctx) {
         const getIsAuthorized = ctx.getters.getIsAuthorized 
       
        if(getIsAuthorized){
            const userInfo = ctx.getters.userInfo
            const token = await localStorage.getItem('token');

            const res = await axios.get(`${keys.host}/api/test-results/get-results`, {
                headers: { 
                    token: token,
                    Authorization: `Bearer ${token}`,
                    userId: userInfo.userId //encodeURIComponent(userId)
               },

      })
      ctx.commit("makeResultsOfWordTest", res.data.results);
         console.log(res.data.results)
        }

   }
  },

  mutations: {
    makeResultsOfWordTest(state, results){
        state.resultsOfWordTest = results
    }


  },

  getters: {
    resultsOfWordTest(state){
        return state.resultsOfWordTest
    }
}
}