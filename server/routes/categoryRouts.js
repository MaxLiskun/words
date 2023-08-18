const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const categoryController  = require('../controllers/categoryController') 

router.post('/add-category', categoryController.addCategory)
router.post('/get-categories', categoryController.getCategories)
router.delete('/delete-category/:id', categoryController.deleteCategory)
router.post('/rename-category', categoryController.renameCategory)




module.exports = router