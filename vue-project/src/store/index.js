import { createStore } from "vuex";

import userInfo from "./modules/userInfo";
import addCategory from "./modules/addCategory";
import categoryList from "./modules/categoryList";
import addWords from "./modules/addWords";
import wordsList from "./modules/wordsList";
import wordsTest from "./modules/wordsTest"
import testWordResults from "./modules/testWordResults";


const store = createStore({
  modules: {
    userInfo,
    addCategory,
    categoryList,
    addWords,
    wordsList,
    wordsTest,
    testWordResults,
  },
});

//export default store;
export default store;
