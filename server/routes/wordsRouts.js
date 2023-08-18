const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const wordsController  = require('../controllers/wordsController') 

router.post('/add-word', wordsController.addNewWord)
router.post('/get-words', wordsController.getUserWords)
router.delete('/delete-word/:id', wordsController.deleteWord)
router.patch('/get-word/:id', wordsController.getWord)
router.patch('/change-word', wordsController.changeWord)

router.get('/check-english-word/:word', wordsController.checkEnglishWord)
router.get('/check-ukrainian-word/:word', wordsController.checkUkrainianWord)

module.exports = router