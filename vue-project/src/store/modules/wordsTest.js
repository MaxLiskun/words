import axios from "axios";
import keys from "../../keys";
import { formatTime,formatDate, getRandomInt } from "./helpers";
export default {
  state: {
    wordsTestSelectedCategory: null,

    mainArrWords: null, // основний масив
    mainArrWordsCopy: [], // копия масива з ноього береться тільки коли в mainArrWords менше 5 обєктів

    userArrWords: {
      //масив для отдачи пользователю
      answers: [],
      question: [],
    },

    trueAnswerArr: [],
    falseAnswerArr: [],

    testRating: null, // для 5 звезного рейтинга 
    testRatingInPercent: null, // для простого рейтинга

    testLangVariant: null,

    resultOfWordsTest: {},

    testInProgress: false,
    startTestTime: null,
    endTestTime: null,
    testIsOver: false,

    leftTimeOfWordsTest: "",
    dateOfWordsTest: "",

    emailStatus: null,
  },

  actions: {
    async wordsTestGetWords(ctx) {
      const category = ctx.state.wordsTestSelectedCategory;
      const response = await axios.post(`${keys.host}/api/words/get-words`, {
        selectedCategory: category.categoryId,
      });
      const data = response.data.data;
      await ctx.commit("makeWordsTestMainArrWords", data);
      await ctx.commit("makeWordsTestMainArrWordsCopy", data);
      await ctx.commit("makeWordsTestUserArrWords", data);
    },

    async sendResultToServer(ctx) {
      const token = await localStorage.getItem("token");
      const testResult = ctx.state.resultOfWordsTest;
      const response = await axios.post(
        `${keys.host}/api/test-results/add-result`,

        { testResult: testResult },

        {
          headers: {
            token: token,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
   //для того щоб коли результати збереглися то вони автоматично обновилися на головній сторінці
            if(response.status === 200) {
              ctx.dispatch('getWordTestResults') // для визова результатов в landing
            }else{
              return
            }
    },
//================================================================
    async sendUserResultToEmail(ctx){
     try {
      const token = await localStorage.getItem("token");
      const testResult = ctx.state.resultOfWordsTest;
      const response = await axios.post(
        `${keys.host}/api/test-results/send-result`,

         { testResult: testResult },

          {
            headers: {
              token: token,
              Authorization: `Bearer ${token}`,
            },
          }
      );
      
  
            if(response.status === 200) {
                  console.log(response, 'Результат успішно надісланий')
                  await ctx.commit('emailStatus', 'success')
                  setTimeout(() =>  ctx.commit('emailStatus', null),1500)
                  
            }else{
                 console.log(response, 'Помилка при надсиланні результату')
                 await ctx.commit('emailStatus', 'fail')
                 setTimeout(() =>  ctx.commit('emailStatus', null),1500)
              return
            }


     } catch (error) {
      console.log(error.response.data)
      await ctx.commit('emailStatus', 'fail')
      setTimeout(() =>  ctx.commit('emailStatus', null),1500)
     }
      
     



    }
    //================================================================
  },

  mutations: {

    //надати статус емейлу типу sending, fail, success. null
    emailStatus(state, data){
    state.emailStatus = data
    console.log(data)
    },



    makeWordsTestSelectedCategory(state, category) {
      state.wordsTestSelectedCategory = category;
      //console.log(state.wordsTestSelectedCategory);
    },

    makeWordsTestMainArrWords(state, data) {
      state.mainArrWords = data;
    },
    makeWordsTestMainArrWordsCopy(state, data) {
      state.mainArrWordsCopy = data;
    },

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
    makeWordsTestUserArrWords(state) {
      state.testInProgress = true;
      state.testIsOver = false;
      
      if (state.mainArrWords.length >= 5) {
        //якщо основний масив слів більше пяти
              const randomNumber = Math.floor(Math.random() * 5);
              const arr = new Set();
        //добавляемо рандомні елементи в мвсив

              while (arr.size < 5) {
                const randomElement =
                  state.mainArrWords[
                    Math.floor(Math.random() * state.mainArrWords.length)
                  ];

                if (Array.from(arr).every((e) => e._id !== randomElement)) {
                  arr.add(randomElement);
                }
              }

              state.userArrWords.answers = Array.from(arr); // Convert the Set to an array
              state.userArrWords.question = state.userArrWords.answers[randomNumber];

        //якщо основний масив слів менше пяти то беремо з резервного
      } else if (
            !state.mainArrWords.length < 5 &&
            state.mainArrWords.length > 0
      ) {
        //берем одне слово із mainArrWords
        const randomWordFromMainArrWords =
          state.mainArrWords[getRandomInt(0, state.mainArrWords.length)];
        const arr2 = new Set();

        while (arr2.size < 5) {
          const randomElement =
            state.mainArrWordsCopy[
              getRandomInt(0, state.mainArrWordsCopy.length)
            ];

          if (
            randomElement._id !== randomWordFromMainArrWords._id &&
            !arr2.has(randomElement._id)
          ) {
            arr2.add(randomElement);
          }
        }

        const newUserArr = Array.from(arr2);
        //Заменяет случайный элемент в массиве newUserArr на randomWordFromMainArrWords.
        newUserArr[getRandomInt(0, newUserArr.length)] =
          randomWordFromMainArrWords;

        state.userArrWords.answers = newUserArr;
        state.userArrWords.question = randomWordFromMainArrWords;
      } else {
              state.testInProgress = false
              state.testIsOver = true
              this.commit('calculateWordTestRating')
              this.commit("clearWordsTestAllArrays");
        
      }
    },

    checkWordsTestAnswer(state, answer) {
      //якщо відповідь правильна то закидуємо
      if (answer._id === state.userArrWords.question._id) {
        state.mainArrWords = state.mainArrWords.filter(
          (el) => el._id !== state.userArrWords.question._id
        );

        this.commit("makeWordsTestTrueAnswerArr", state.userArrWords.question);
        this.commit("makeWordsTestUserArrWords");
      } else if (answer._id !== state.userArrWords.question._id) {
        state.mainArrWords = state.mainArrWords.filter(
          (el) => el._id !== state.userArrWords.question._id
        );

        this.commit("makeWordsTestFalseAnswerArr", state.userArrWords.question);
        this.commit("makeWordsTestUserArrWords");
      }
    },

    checkDateTimeOfTest(state, value) {
      if (value) {
        state.startTestTime = new Date();
      } else {
        state.endTimeTest = new Date();
        const time = formatTime(
          (state.endTimeTest - state.startTestTime) / 1000
        );

        const date = formatDate();

        state.leftTimeOfWordsTest = time;
        state.dateOfWordsTest = date;
      }
    },

    makeWordsTestTrueAnswerArr(state, question) {
      state.trueAnswerArr.push(question);
     
    },
    makeWordsTestFalseAnswerArr(state, question) {
      state.falseAnswerArr.push(question);
    },




    clearWordsTestMainArrWordsCopy(state) {
      state.mainArrWordsCopy = [];
    },
    clearWordsTestMainArrWords(state, data) {
      state.mainArrWords = [];
    },
    clearWordsTestUserArrWords(state) {
      state.userArrWords.answers = [];
      state.userArrWords.question = [];
    },
    clearWordsTestAllArrays(state) {
      state.mainArrWords = [];
      state.userArrWords.answers = [];
      state.userArrWords.question = [];
      state.mainArrWordsCopy = [];
      state.testInProgress = false;
  
    },
    clearWordsTestFalseTrueAnswersArr(state) {
      state.trueAnswerArr = [];
      state.falseAnswerArr = [];
    },

    resetTestIsOverStatus(state) {
      state.testIsOverStatus = false;
      console.log(state.testIsOverStatus)
      
    },

    setTestLangVariant(state, data){ // для того щоб знати варіант тесту uk-en en-uk
    state.testLangVariant = data
    },

    //resetTestIsOverStatus
//================================================================
    makeWordsTestResult(state) {
      state.resultOfWordsTest = {
        dateOfWordsTest: state.dateOfWordsTest,
        userInfo: this.getters.userInfo,
        selectedCategory: state.wordsTestSelectedCategory,
        testLangVariant: state.testLangVariant,
        leftTimeOfWordsTest: state.leftTimeOfWordsTest,
        trueAnswersCount: state.trueAnswerArr.length,
        falseAnswersCount: state.falseAnswerArr.length,
        falseAnswersArr: state.falseAnswerArr,
        trueAnswerArr: state.trueAnswerArr,
        rating: state.testRating,
        ratingInPercent: state.testRatingInPercent,
      };

      ;
       this.commit("clearWordsTestFalseTrueAnswersArr");
       this.commit('clearWordTestRating')
    },

    clearWordTestResult(state){
      state.resultOfWordsTest = {}
    },

    
    //rating
    calculateWordTestRating(state){
     const percentage = (state.trueAnswerArr.length / state.wordsTestSelectedCategory.wordCount) * 100;
     state.testRatingInPercent = Math.round(percentage) // для простого рейтинга
     state.testRating =  (percentage / 100) * 5;// для пятизвездочного рейтинга

    },
    clearWordTestRating(state){
    state.testRating = null
    }

    
  },

  getters: {
    getWordsTestSelectedCategory(state) {
      return state.wordsTestSelectedCategory;
    },
    getWordsTestUserArrWords(state) {
      return state.userArrWords;
    },
    getWordTestTestInProgress(state) {
      return state.testInProgress;
    },

    getResultOfWordsTest(state) {
      return state.resultOfWordsTest;
    },
    getTrueAnswersArr(state) {
      return state.trueAnswerArr
    },
    getFalseAnswersArr(state){
      return state.falseAnswerArr
    },
    getTestIsOverStatus(state) {
      return state.testIsOver
    },

    getEmailStatus(state){
      return state.emailStatus
    }
  
  },
};
