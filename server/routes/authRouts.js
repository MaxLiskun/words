const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const authController  = require('../controllers/authController') 

router.post('/register', authController.register)
router.post('/login', authController.login)




module.exports = router