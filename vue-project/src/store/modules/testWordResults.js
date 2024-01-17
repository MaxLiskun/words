import axios from "axios";
import router from "../../router/index";
import keys from "../../keys";
export default {
  state: {
  resultsOfWordTest: [],
  },



  actions: {
    async getWordTestResults(ctx) {
    //        const getIsAuthorized = ctx.getters.getIsAuthorized 
       
    //     if(getIsAuthorized){
    //         const userInfo = ctx.getters.userInfo
    //         const token = await localStorage.getItem('token');

    //         const res = await axios.get(`${keys.host}/api/test-results/get-results`, {
    //             headers: { 
    //                 token: token,
    //                 Authorization: `Bearer ${token}`,
    //                 userId: userInfo.userId //encodeURIComponent(userId)
    //            },

    //   })
    //   ctx.commit("makeResultsOfWordTest", res.data.results.reverse());
    //      console.log(res.data.results)

       


    //     }
    try {
        const getIsAuthorized = ctx.getters.getIsAuthorized;
    
        if (getIsAuthorized) {
          const userInfo = ctx.getters.userInfo;
          const token = await localStorage.getItem('token');
    
          if (!token) {
            console.error('Токен отсутствует');
            return;
          }
    
          const res = await axios.get(`${keys.host}/api/test-results/get-results`, {
            params: {
              userId: userInfo.userId,
            },
            headers: {
              token: token,
              Authorization: `Bearer ${token}`,
            },
          });

         // console.log(res.data.gropedByDate);
          ctx.commit("makeResultsOfWordTest", res.data.groupedByDateSortedFromNew);
     
        }
      } catch (error) {
        console.error('Ошибка при получении результатов:', error);
        // Обработка ошибки, например, можно вывести уведомление для пользователя
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