const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const keys = require("../keys");
const cors = require("cors");
const mongoose = require("mongoose");

const Words = require("../models/Word");

const fs = require('fs')
const Nodehun = require('nodehun')

const addNewWord = async (req, res) => {
  console.log(req.body)
  try {
    const sameWord = await Words.findOne({
      inEnglish: req.body.inEnglish,
      inUkrainian: req.body.inUkrainian,
      inTranscription: req.body.inTranscription,
    });

    if (sameWord) {
      res.status(409).json({ message: "Таке слово уже існує" });
    } else {
   

      const word = new Words({
        inEnglish: req.body.inEnglish,
        inUkrainian: req.body.inUkrainian,
        inTranscription: req.body.inTranscription,
        categoryId: req.body.categoryId,
       category: req.body.categoryObj_Id, // тут должно бить _id
      });
      await word.save();
      res.status(201).json({ message: "Слово додане)))" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка при збереженні слова(((" });
  }
};

const getUserWords = async (req, res) => {
 
  try {
    const data = await Words.find({ categoryId: req.body.selectedCategory });

    res.status(200).json({ message: "Слова знайдені", data });
  } catch (error) {
    res.status(500).json({ message: "Помилка при пошуку слів" });
  }
};

const deleteWord = async (req, res) => {
  try {
    const id = req.params.id;

    const word = await Words.findOne({ _id: id });
    if (word) {
      const response = await Words.findOneAndDelete({ _id: id });
      res.status(200).json({ message: "Слово видалено)" });
    } else {
      res.status(500).json({ message: "Слово не знайдене в базі данних" });
    }
  } catch (error) {
    res.status(500).json({ message: "Помилка при видаленні(" });
  }
};

const getWord = async (req, res) => {
try {
  const word = await Words.findOne({_id: req.params.id})
  res.status(200).json({ message: 'Слово знайдене', word });
} catch (error) {
  res.status(500).json({ message: 'Слово не знайдене'})
}
}

const changeWord = async (req, res) => {
  try {
    const word = await Words.findOne({_id: req.body.newWord._id})
   if(word){
  word.inEnglish = req.body.newWord.inEnglish
  word.inUkrainian = req.body.newWord.inUkrainian
  word.inTranscription = req.body.newWord.inTranscription
  await word.save()
  res.status(201).json({ message: 'Слово змінено'})
   }else{
    res.status(500).json({ message: 'Слово не знайдено'})
   }
  } catch (error) {
    res.status(500).json({ message: 'Помилка при зміні слова'})
  }
}







const checkEnglishWord = async (req, res) =>{
  try {
    console.log('1\\\\\\\\\\\\\\')
    const affix = fs.readFileSync(__dirname + '/../nodehun/dictionaries/en/index.aff')
    const dictionary = fs.readFileSync(__dirname +'/../nodehun/dictionaries/en/index.dic')
    console.log('2\\\\\\\\\\\\\\')
    const nodehun = new Nodehun(affix, dictionary)
    console.log('3\\\\\\\\\\\\\\')
    const word = await req.params.word
    console.log('4\\\\\\\\\\\\\\')
    const suggestions = await nodehun.suggest(word)
    console.log('5\\\\\\\\\\\\\\')
    res.status(200).json({ message: 'Знайдені віріанти', suggestions:suggestions})
    
  } catch (error) {
    console.log('6\\\\\\\\\\\\\\')
    res.status(500).json({ message: 'Помилка у знаходжені збігів'})
  }
 


}



const checkUkrainianWord = async (req, res) =>{

//   const affix = fs.readFileSync('../nodehun/dictionaries/uk/index.aff')
//   const dictionary = fs.readFileSync('../nodehun/dictionaries/uk/index.dic')
//    const nodehun = new Nodehun(affix, dictionary)
// console.log(nodehun)
  res.status(200).json({ message: 'hello uk'})
}




// const affix = fs.readFileSync(__dirname + '/../nodehun/dictionaries/uk/index.aff')
// console.log(affix)

//const dictionary = fs.readFileSync('../nodehun/dictionaries/en/index.dic')



module.exports = {
  addNewWord,
  getUserWords,
  deleteWord,
  getWord,
  changeWord,
  checkEnglishWord,
  checkUkrainianWord
};
