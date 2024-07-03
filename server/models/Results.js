const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const wordSchema = new Schema({
    _id: String,
    inEnglish: String,
    inUkrainian: String,
    inTranscription: String,
    categoryId: String,
    category: String,
    __v: Number,
  });
  
  const categorySchema = new Schema({
    _id: String,
    name: String,
    userId: String,
    categoryId: String,
    __v: Number,
    wordCount: Number,
  });
  
  const userInfoSchema = new Schema({
    name: String,
    lastName: String,
    userPhone: String,
    avatar: String,
    motherFatherEmail: String,
    motherFatherPhone: String,
    userId: String,
  });

  
  
  const resultSchema = new Schema({
    dateOfWordsTest: String,
    userInfo: userInfoSchema,
    selectedCategory: categorySchema,
    leftTimeOfWordsTest: String,
    testLangVariant: String,
    trueAnswersCount: Number,
    falseAnswersCount: Number,
    falseAnswersArr: [wordSchema],
    resultId: String, // Отдельное поле для userId
    timeOfWordsTest: String,
    rating: Number,
    ratingInPercent: Number,
  });
  
  const WordTestResult = mongoose.model("WordTestResult", resultSchema);
  
  module.exports = WordTestResult;






