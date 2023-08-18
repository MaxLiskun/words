import axios from "axios";
import keys from "../../keys";
import { formatTime,formatDate, getRandomInt } from "./helpers";
export default {
  state: {
    wordsTestSelectedCategory: null,

    mainArrWords: null,
    mainArrWordsCopy: [],

    userArrWords: {
      answers: [],
      question: [],
    },

    trueAnswerArr: [],
    falseAnswerArr: [],

    resultOfWordsTest: [],

    testInProgress: false,
    startTestTime: null,
    endTestTime: null,

    leftTimeOfWordsTest: "",
    dateOfWordsTest: "",
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
  },

  mutations: {
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



    makeWordsTestUserArrWords(state) {
      state.testInProgress = true;

      if (state.mainArrWords.length >= 5) {
        const randomNumber = Math.floor(Math.random() * 5);

        const arr = new Set();
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
      } else if (
        !state.mainArrWords.length < 5 &&
        state.mainArrWords.length > 0
      ) {
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
            Array.from(arr2).every((i) => i._id !== randomElement._id)
          ) {
            arr2.add(randomElement);
          }
        }

        const newUserArr = Array.from(arr2);

        newUserArr[getRandomInt(0, newUserArr.length)] =
          randomWordFromMainArrWords;
        state.userArrWords.answers = newUserArr;
        state.userArrWords.question = randomWordFromMainArrWords;
      } else {
        state.testInProgress = false;

        this.commit("clearWordsTestAllArrays");
      }
    },
    checkWordsTestAnswer(state, answer) {
      if (answer._id === state.userArrWords.question._id) {
        state.mainArrWords = state.mainArrWords.filter(
          (el) => el._id !== state.userArrWords.question._id
        );

        this.commit("makeWordsTestUserArrWords");
        this.commit("makeWordsTestTrueAnswerArr", state.userArrWords.question);
      } else if (answer._id !== state.userArrWords.question._id) {
        state.mainArrWords = state.mainArrWords.filter(
          (el) => el._id !== state.userArrWords.question._id
        );

        this.commit("makeWordsTestUserArrWords");
        this.commit("makeWordsTestFalseAnswerArr", state.userArrWords.question);
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
      //  console.log("true", state.trueAnswerArr);
    },
    makeWordsTestFalseAnswerArr(state, question) {
      state.falseAnswerArr.push(question);
      // console.log("false", state.falseAnswerArr);
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
    },
    clearWordsTestFalseTrueAnswersArr(state){
      state.trueAnswerArr = []
      state.falseAnswerArr = []
    },


    makeWordsTestResult(state) {
      const res = {
        dateOfWordsTest: state.dateOfWordsTest,
        leftTimeOfWordsTest: state.leftTimeOfWordsTest,
        name: this.getters.userInfo,
        selectedCategory: state.wordsTestSelectedCategory,
        truAnswersCount: state.trueAnswerArr.length,
        falseAnswerCount: state.falseAnswerArr.length,
        falseAnswerArr: state.falseAnswerArr,
      };
      state.resultOfWordsTest = res
      console.log(state.resultOfWordsTest);
      this.commit('clearWordsTestFalseTrueAnswersArr')
    },
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
  },
};
