import axios from "axios";
import router from "../../router/index";

export default {
  state: {
    userInfo: {
      name: "",
      lastName: "",
      userPhone: "",
      avatar: "",
      motherFatherEmail: "",
      motherFatherPhone: "",
      userId: "",
    },

   

    isAuthorized: false,
  

  },
  actions: {
    async getInfo(ctx) {
      
      try {
        const token = await localStorage.getItem('token');
       
      if(token){
          const candidate = await axios.get(
            "http://localhost:3000/api/user/info",
            {
              headers: { 
                  token: localStorage.getItem("token"),
                  Authorization: `Bearer ${token}`
             },
    });
          const user = candidate.data.decoded;
        // console.log(user);
          ctx.commit("makeUser", user);
          ctx.commit('setIsAuthorized', true)


        setTimeout(()=>{
          ctx.dispatch('getInfo')
          
        },2000)

       
          
        }else{
       
          ctx.commit('setIsAuthorized', false)

        }
    

      } catch (error) {
        if (error.response && error.response.status === 401) {
        
          ctx.commit('setIsAuthorized', false)
          router.push("/login");
        }
      }
    },
  
  },

  mutations: {
    makeUser(state, user) {
  
      state.userInfo.name = user.name;
      state.userInfo.lastName = user.lastName;
      state.userInfo.userPhone = user.userPhone;
      state.userInfo.avatar = user.avatar
      state.userInfo.userId = user.userId

      state.userInfo.motherFatherEmail = user.motherFatherEmail;
      state.userInfo.motherFatherPhone = user.motherFatherPhone;
     
    },
    clearUser(state) {
      state.userInfo.name = ''
      state.userInfo.lastName = ''
      state.userInfo.userPhone = ''
      state.userInfo.avatar = ''
      state.userInfo.userId = ''

      state.userInfo.motherFatherEmail = ''
      state.userInfo.motherFatherPhone = ''
    },

    setIsAuthorized(state, trueOrFalse){
      state.isAuthorized = trueOrFalse;
   
    },


  

  },

  getters: {
    userInfo(state) {
      return state.userInfo;
    },
    getIsAuthorized(state){
 return state.isAuthorized
    }
  },
};
